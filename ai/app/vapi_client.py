import os
import requests
import json
from dotenv import load_dotenv, find_dotenv

# Explicitly find and load the .env file from the root directory
load_dotenv(find_dotenv(), override=True)

VAPI_API_KEY = os.getenv("VAPI_API_KEY", "your-vapi-api-key")
VAPI_BASE_URL = "https://api.vapi.ai"
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
VAPI_DEFAULT_TOOL_ID = os.getenv("VAPI_DEFAULT_TOOL_ID", "")

def get_vapi_server_url():
    url = os.getenv("VAPI_SERVER_URL", "").strip()
    print(f"DEBUG: Loaded VAPI_SERVER_URL = '{url}'")
    return url

HEADERS = {
    "Authorization": f"Bearer {VAPI_API_KEY}",
    "Content-Type": "application/json"
}

def create_assistant(business_id: str, system_prompt: str, business_name: str = "") -> dict:
    """
    Creates or updates an assistant on Vapi. If an assistant with the name
    already exists, it updates it in-place using PATCH so changes are published instantly.
    Uses business_name for customer-facing messages (firstMessage, endCall).
    """
    existing_id = None
    try:
        # Search for existing assistant with this name/business_id to prevent duplicates and auto-publish
        list_url = f"{VAPI_BASE_URL}/assistant"
        list_res = requests.get(list_url, headers=HEADERS)
        if list_res.status_code == 200:
            assistants = list_res.json()
            for ast in assistants:
                if ast.get("name") == business_id or ast.get("metadata", {}).get("business_id") == business_id:
                    existing_id = ast.get("id")
                    break
    except Exception as e:
        print(f"Warning: Failed to search for existing assistant: {e}")

    # Strictly use the tool ID configured in the .env for all agents
    tool_ids = []
    if VAPI_DEFAULT_TOOL_ID:
        tool_ids.append(VAPI_DEFAULT_TOOL_ID)

    vapi_server_url = get_vapi_server_url()

    # Use business_name for customer-facing messages, fall back to business_id
    display_name = business_name if business_name else business_id

    payload = {
        "name": business_id, # Exactly the name you provide
        "firstMessage": f"Hi, you're through to {display_name} and I'm FireVoice, their virtual assistant. How can I help you today?",
        "metadata": {
            "business_id": business_id
        },
        "model": {
            "provider": "openai",
            "model": LLM_MODEL,
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                }
            ],
            "temperature": 0.4,
            "toolIds": tool_ids, # Links your dashboard-created tool inside model
            "tools": [
                {
                    "type": "endCall",
                    "messages": [
                        {
                            "type": "request-start",
                            "content": f"Thanks for calling {display_name}. We look forward to seeing you!"
                        }
                    ],
                    "function": {
                        "name": "endCall",
                        "description": "Ends the phone call. Invoke this tool immediately when the appointment is booked or the conversation naturally ends. Do NOT say goodbye yourself, just trigger this tool."
                    }
                }
            ]
        },
        "voice": {
            "provider": "11labs",
            "voiceId": "FF59babHL8N8gfTgtBMT",
            "model": "eleven_flash_v2_5"
        },
        "transcriber": {
            "provider": "deepgram",
            "model": "nova-2",
            "language": "en"
        },
        "analysisPlan": {
            "summaryPlan": {
                "enabled": True,
                "messages": [
                    {
                        "role": "system",
                        "content": "Provide a concise summary of the call. Include the patient's name, their mood, what service or appointment they booked, which doctor (if specified), preferred date and time, visit type (in-person or telehealth), total fee, payment method chosen, and if the booking was successfully handled."
                    },
                    {
                        "role": "user",
                        "content": "Here is the transcript:\n\n{{transcript}}\n\n. Here is the ended reason of the call:\n\n{{endedReason}}\n\n"
                    }
                ]
            },
            "structuredDataPlan": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "services": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "service_name": {"type": "string"},
                                    "doctor_name": {"type": "string"},
                                    "service_fee": {"type": "string"}
                                },
                                "required": ["service_name", "doctor_name", "service_fee"]
                            }
                        },
                        "total_fee": {"type": "number"},
                        "booking_status": {"type": "string", "enum": ["confirmed", "cancelled", "pending"]},
                        "patient_name": {"type": "string"},
                        "patient_age": {"type": "string"},
                        "patient_phone": {"type": "string"},
                        "payment_method": {"type": "string", "enum": ["cash", "card", "insurance", "unknown"]},
                        "insurance_provider": {"type": "string"},
                        "visit_type": {"type": "string", "enum": ["in_person", "telehealth"]},
                        "preferred_date": {"type": "string"},
                        "preferred_time": {"type": "string"}
                    },
                    "required": ["services", "total_fee", "booking_status", "patient_name", "patient_age", "visit_type", "preferred_date", "preferred_time"]
                },
                "messages": [
                    {
                        "role": "system",
                        "content": "Extract the final appointment booking details for database logging. For each service in 'services', extract 'service_name' (the medical service or test booked), 'doctor_name' (the doctor's name, or 'Any Available' if not specified), and 'service_fee' (the fee as a decimal string, e.g. '50.00', '35.00'). Look at the individual fees spoken or recited in the transcript. Do NOT output 'unknown' or '0.0' for service_fee. If a fee was spoken in words like 'fifty dollars', output '50.00'. For 'total_fee', output the final total stated by the assistant. The visit_type MUST be exactly 'in_person' or 'telehealth'. Extract 'patient_name', 'patient_age', 'patient_phone', 'preferred_date', 'preferred_time', 'payment_method', and 'insurance_provider' (empty string if not applicable) from the transcript.\n\nJson Schema:\n{{schema}}\n\nOnly respond with the JSON."
                    },
                    {
                        "role": "user",
                        "content": "Here is the transcript:\n\n{{transcript}}\n\n. Here is the ended reason of the call:\n\n{{endedReason}}\n\n"
                    }
                ]
            },
            "successEvaluationPlan": {
                "enabled": True,
                "rubric": "PassFail"
            }
        }
    }
    
    if vapi_server_url:
        payload["server"] = {
            "url": vapi_server_url,
            "timeoutSeconds": 20
        }
    
    print(f"DEBUG PAYLOAD TO VAPI: {json.dumps(payload, indent=2)}")
    
    if existing_id:
        print(f"[SYNC] Assistant '{business_id}' already exists (ID: {existing_id}). Updating in-place...")
        url = f"{VAPI_BASE_URL}/assistant/{existing_id}"
        response = requests.patch(url, headers=HEADERS, json=payload)
    else:
        print(f"[NEW] Creating new assistant '{business_id}'...")
        url = f"{VAPI_BASE_URL}/assistant"
        response = requests.post(url, headers=HEADERS, json=payload)

    if response.status_code >= 400:
        # Return the actual error from Vapi so it shows in the browser
        error_msg = response.text
        print(f"DEBUG VAPI ERROR: {error_msg}")
        raise Exception(f"Vapi Error: {error_msg} | Payload sent: {json.dumps(payload)}")
    
    return response.json()


def link_telephony(assistant_id: str, twilio_number: str, manager_number: str) -> dict:
    """
    Links a Twilio phone number to the created Vapi assistant.
    The twilio_number must exist in the Twilio account linked to Vapi.
    """
    url = f"{VAPI_BASE_URL}/phone-number"
    
    payload = {
        "provider": "twilio",
        "number": twilio_number,
        "assistantId": assistant_id,
        "twilioAccountSid": os.getenv("TWILIO_ACCOUNT_SID", ""),
        "twilioAuthToken": os.getenv("TWILIO_AUTH_TOKEN", ""),
        "name": f"Line for {assistant_id[:25]}"
    }
    
    response = requests.post(url, headers=HEADERS, json=payload)
    if response.status_code >= 400:
        raise Exception(f"Vapi Error {response.status_code}: {response.text}")
    
    if manager_number:
        # Fetch all global tools to avoid duplicates
        tool_url = f"{VAPI_BASE_URL}/tool"
        all_tools_res = requests.get(tool_url, headers=HEADERS)
        all_tools = all_tools_res.json() if all_tools_res.status_code == 200 else []
        
        # Find if a transfer tool for this manager number already exists
        existing_transfer_tools = [t for t in all_tools if t.get("type") == "transferCall"]
        tool_id = None
        
        for t in existing_transfer_tools:
            dests = t.get("destinations", [])
            if dests and dests[0].get("number") == manager_number:
                tool_id = t["id"]
                break
                
        # If not found, create it
        if not tool_id:
            tool_payload = {
                "type": "transferCall",
                "destinations": [
                    {
                        "type": "number",
                        "number": manager_number,
                        "message": "Please hold while I transfer you to reception."
                    }
                ],
                "function": {
                    "name": "transferToReception",
                    "description": "Transfers the call to reception or front desk immediately. Invoke this tool without asking why when: the caller asks to speak to a human, a person, or a receptionist; the caller has a medical emergency; the caller makes a complaint; the caller asks about test results or medical records; the caller requests a refund or disputes a billing issue; the caller is unhappy or frustrated; the caller has chosen card payment and the booking has been saved."
                }
            }
            tool_res = requests.post(tool_url, headers=HEADERS, json=tool_payload)
            if tool_res.status_code >= 400:
                raise Exception(f"Vapi Tool Creation Error {tool_res.status_code}: {tool_res.text}")
            tool_id = tool_res.json().get("id")
        
        # Patch the assistant — clean all transferCall references, then add single correct one
        patch_assistant_url = f"{VAPI_BASE_URL}/assistant/{assistant_id}"
        get_res = requests.get(patch_assistant_url, headers=HEADERS)
        if get_res.status_code == 200:
            assistant_data = get_res.json()
            model_data = assistant_data.get("model", {})
            
            # Clean model.tools array (remove any inline transferCall tools)
            if "tools" in model_data:
                model_data["tools"] = [t for t in model_data["tools"] if t.get("type") != "transferCall"]
                
            # Clean model.toolIds — remove ALL transferCall tool IDs
            existing_tool_ids = model_data.get("toolIds", [])
            all_transfer_ids = [t["id"] for t in existing_transfer_tools]
            existing_tool_ids = [tid for tid in existing_tool_ids if tid not in all_transfer_ids]
            
            # Add our single desired tool_id
            existing_tool_ids.append(tool_id)
            model_data["toolIds"] = existing_tool_ids
            
            patch_payload = {"model": model_data}
            patch_res = requests.patch(patch_assistant_url, headers=HEADERS, json=patch_payload)
            if patch_res.status_code >= 400:
                raise Exception(f"Vapi Patch Error {patch_res.status_code}: {patch_res.text}")
            
    return response.json()

def unlink_telephony(phone_number_id: str) -> dict:
    """
    Unlinks and deletes a Twilio phone number from the Vapi account.
    """
    url = f"{VAPI_BASE_URL}/phone-number/{phone_number_id}"
    response = requests.delete(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()
