import os
import shutil
import requests
from typing import Optional
from fastapi import FastAPI, UploadFile, Form, HTTPException, File, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv

load_dotenv()

EXTERNAL_BACKEND_URL = os.getenv("EXTERNAL_BACKEND_URL", "")

from app.extractor import extract_text, generate_clinic_prompt, extract_business_name
from app.vapi_client import create_assistant, link_telephony, unlink_telephony

from app.business_store import save_business_config, get_business_config, load_all_business_configs

def parse_single_string_item(item_str: str) -> dict:
    import re
    item_str = item_str.strip()
    match = re.match(r"^(\d+)\s*x?\s*(.+)$", item_str, re.IGNORECASE)
    if match:
        quantity = match.group(1)
        service_name = match.group(2).strip()
        return {
            "service_name": service_name,
            "quantity": quantity,
            "service_fee": "0.0"
        }
    return {
        "service_name": item_str,
        "quantity": "1",
        "service_fee": "0.0"
    }

def normalize_list(items) -> list:
    normalized = []
    if not isinstance(items, list):
        items = [items]
    for item in items:
        if isinstance(item, dict):
            service_name = item.get("service_name") or item.get("product_name") or item.get("name") or item.get("item") or "Unknown Service"
            doctor_name = item.get("doctor_name") or item.get("doctor") or "Any Available"
            quantity = item.get("quantity") or item.get("qty") or item.get("count") or "1"
            service_fee = item.get("service_fee") or item.get("unit_prize") or item.get("unit_price") or item.get("fee") or item.get("price")

            if service_fee is not None and str(service_fee).strip().lower() not in ["", "unknown", "none", "null"]:
                import re
                fee_str = str(service_fee).strip()
                # Clean currency symbol (e.g. $50.00 -> 50.00)
                cleaned_fee = re.sub(r"[^\d\.]", "", fee_str)
                service_fee = cleaned_fee if cleaned_fee else fee_str
            else:
                service_fee = "0.0"

            normalized.append({
                "service_name": str(service_name),
                "doctor_name": str(doctor_name),
                "quantity": str(quantity),
                "service_fee": str(service_fee)
            })
        elif isinstance(item, str):
            parsed_item = parse_single_string_item(item)
            if parsed_item:
                normalized.append(parsed_item)
    return normalized

def parse_and_format_booking_details(booking_items, total_fee) -> list:
    """
    Parses and formats booking_items into the structured schema:
    [
        {
            "service_name": str,
            "doctor_name": str,
            "quantity": str,
            "service_fee": str
        }
    ]
    """
    if not booking_items:
        return []

    # Case 1: If booking_items is a string, try to parse it as JSON first
    if isinstance(booking_items, str):
        cleaned = booking_items.strip()
        if (cleaned.startswith("{") and cleaned.endswith("}")) or (cleaned.startswith("[") and cleaned.endswith("]")):
            try:
                import json
                parsed = json.loads(cleaned)
                if isinstance(parsed, dict) and "booking_details" in parsed:
                    return normalize_list(parsed["booking_details"])
                if isinstance(parsed, dict) and "order_details" in parsed:
                    return normalize_list(parsed["order_details"])
                if isinstance(parsed, dict):
                    return normalize_list([parsed])
                if isinstance(parsed, list):
                    return normalize_list(parsed)
            except Exception:
                pass

    # Case 2: If it is already a dictionary
    if isinstance(booking_items, dict):
        if "booking_details" in booking_items:
            return normalize_list(booking_items["booking_details"])
        if "order_details" in booking_items:
            return normalize_list(booking_items["order_details"])
        return normalize_list([booking_items])

    # Case 3: If it is already a list
    if isinstance(booking_items, list):
        return normalize_list(booking_items)

    # Case 4: Unstructured string fallback
    parsed_items = []
    if isinstance(booking_items, str):
        parts = [p.strip() for p in booking_items.replace("\n", ",").split(",") if p.strip()]
        for part in parts:
            parsed_item = parse_single_string_item(part)
            if parsed_item:
                parsed_items.append(parsed_item)
    
    import os
    openai_key = os.getenv("OPENAI_API_KEY", "")
    if openai_key and parsed_items:
        try:
            import openai
            client = openai.OpenAI(api_key=openai_key)
            prompt = f"""
            You are an expert booking parser. Convert the following unstructured booking items string and total fee into a clean, structured JSON list of objects.
            
            Booking items string: "{booking_items}"
            Total Fee: {total_fee}
            
            For each service, extract:
            - "service_name": Name of the medical service or test (e.g. "General Consultation", "Blood Test").
            - "doctor_name": The doctor's name if mentioned, otherwise "Any Available".
            - "quantity": Number booked as a string (e.g. "1").
            - "service_fee": Fee for this service as a string (e.g. "50.00").
            
            Respond ONLY with a valid JSON array of objects, like this:
            [{{"service_name": "General Consultation", "doctor_name": "Dr. Smith", "quantity": "1", "service_fee": "50.00"}}]
            Do not include any markdown backticks, explanations, or comments.
            """
            
            response = client.chat.completions.create(
                model=os.getenv("LLM_MODEL", "gpt-4o-mini"),
                messages=[{"role": "user", "content": prompt}],
                temperature=0.0
            )
            content = response.choices[0].message.content.strip()
            
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
                content = content.strip("` \n")
                
            import json
            parsed = json.loads(content)
            if isinstance(parsed, list):
                return normalize_list(parsed)
        except Exception as e:
            print(f" OpenAI parsing failed, using regex fallback: {str(e)}")
            
    return parsed_items

app = FastAPI(title="Clinic Voice Agent Microservice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)



class TelephonyLinkRequest(BaseModel):
    assistant_id: str
    twilio_number: str
    manager_number: str

@app.post("/api/agents/create")
async def create_agent(
    business_id: str = Form(...),
    rules_file: UploadFile = File(...),
    services_file: UploadFile = File(...)
):
    """
    Creates or updates a Vapi assistant for a clinic/hospital.
    Accepts a rules file (clinic policies) and a services file (services, fees, doctors).
    """
    saved_paths = []

    try:
        rules_path = f"uploads/{business_id}_rules_{rules_file.filename}"
        services_path = f"uploads/{business_id}_services_{services_file.filename}"

        saved_paths.extend([rules_path, services_path])

        with open(rules_path, "wb") as buffer:
            shutil.copyfileobj(rules_file.file, buffer)

        with open(services_path, "wb") as buffer:
            shutil.copyfileobj(services_file.file, buffer)

        rules_text = extract_text(rules_path)
        services_text = extract_text(services_path)

        business_name = extract_business_name(rules_text, business_id)

        system_prompt = generate_clinic_prompt(
            business_id,
            rules_text,
            services_text,
            business_name=business_name
        )

        vapi_response = create_assistant(business_id, system_prompt, business_name=business_name)

        save_business_config(
            business_id,
            {
                "business_id": business_id,
                "business_name": business_name,
                "rules_text": rules_text,
                "services_text": services_text,
                "assistant_id": vapi_response.get("id")
            }
        )

        return {
            "status": "success",
            "business_id": business_id,
            "assistant_id": vapi_response.get("id"),
            "message": "Clinic agent created or updated successfully.",
            "vapi_response": vapi_response
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        for path in saved_paths:
            try:
                if os.path.exists(path):
                    os.remove(path)
            except Exception:
                pass


@app.patch("/api/agents/services")
async def update_services(
    assistant_id: str,
    services_file: UploadFile = File(...)
):
    """
    Updates the services list for an existing Vapi assistant.

    Accepts a new services file (.xlsx, .pdf, .docx, .txt, .csv), extracts its text,
    rebuilds the full system prompt using the stored rules, then
    PATCHes the live Vapi assistant in-place. The stored business config is also
    updated with the new services_text.

    Rules are preserved.
    """
    try:
        # --- 1. Load stored config based on assistant_id ---
        configs = load_all_business_configs()
        business_id = None
        config = None
        for b_id, c in configs.items():
            if c.get("assistant_id") == assistant_id:
                business_id = b_id
                config = c
                break

        if not config:
            raise HTTPException(
                status_code=404,
                detail=f"Business config not found for assistant_id '{assistant_id}'. Create the agent first using /api/agents/create."
            )
            
        services_path = f"uploads/{business_id}_services_{services_file.filename}"

        # --- 2. Save and extract the new services file ---
        with open(services_path, "wb") as buffer:
            shutil.copyfileobj(services_file.file, buffer)

        new_services_text = extract_text(services_path)

        if not new_services_text or not new_services_text.strip():
            raise HTTPException(
                status_code=400,
                detail="The uploaded services file appears to be empty or could not be read."
            )

        # --- 3. Rebuild the system prompt with NEW services, EXISTING rules ---
        rules_text = config.get("rules_text", "")

        business_name = extract_business_name(rules_text, business_id)

        system_prompt = generate_clinic_prompt(
            business_id,
            rules_text,
            new_services_text,
            business_name=business_name
        )

        # --- 4. PATCH the Vapi assistant in-place ---
        vapi_response = create_assistant(business_id, system_prompt, business_name=business_name)

        # --- 5. Persist the updated services_text to the config store ---
        config["services_text"] = new_services_text
        config["assistant_id"] = vapi_response.get("id")
        save_business_config(business_id, config)

        # Short preview of the new services for confirmation
        services_preview = new_services_text.strip()[:300]

        return {
            "status": "success",
            "business_id": business_id,
            "assistant_id": vapi_response.get("id"),
            "message": "Services updated successfully. The assistant prompt has been refreshed with the new services list.",
            "services_preview": services_preview + ("..." if len(new_services_text.strip()) > 300 else "")
        }

    except HTTPException:
        raise

    except ValueError as e:
        # Raised by extract_text() for unsupported file types
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        try:
            if os.path.exists(services_path):
                os.remove(services_path)
        except Exception:
            pass


@app.post("/api/telephony/link")
async def link_phone(request: TelephonyLinkRequest):
    """
    Links a Twilio phone number to a specific Vapi assistant.
    Also records the manager_number (can be used for call transfers later).
    """
    try:
        response = link_telephony(
            assistant_id=request.assistant_id,
            twilio_number=request.twilio_number,
            manager_number=request.manager_number
        )
        
        return {
            "status": "success",
            "message": "Telephony linked successfully.",
            "vapi_response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/telephony/unlink/{phone_number_id}")
async def unlink_phone(phone_number_id: str):
    """
    Unlinks and deletes a Twilio phone number using its Vapi ID.
    """
    try:
        response = unlink_telephony(phone_number_id)
        return {
            "status": "success",
            "message": "Telephony unlinked successfully.",
            "vapi_response": response
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- VAPI WEBHOOKS ---

def forward_booking_task(business_id: str, assistant_id: str, args: dict):
    """Runs in the background to prevent Vapi tool timeouts"""
    if EXTERNAL_BACKEND_URL:
        try:
            # Parse and format the booking items safely in the background
            booking_details = parse_and_format_booking_details(args.get("booking_details") or args.get("order_items"), args.get("total_fee") or args.get("total_price"))
            
            forward_payload = {
                "assistantId": assistant_id,
                "business_id": business_id,
                "patient_name": args.get("patient_name") or args.get("customer_name"),
                "patient_age": args.get("patient_age"),
                "patient_phone": args.get("patient_phone"),
                "booking_items": args.get("booking_details") or args.get("order_items"),  # KEEP original key for backward compatibility
                "booking_details": booking_details,          # Structured JSON format
                "services": booking_details,                 # Services key matching schema
                "preferred_date": args.get("preferred_date"),
                "preferred_time": args.get("preferred_time"),
                "visit_type": args.get("visit_type"),
                "payment_method": args.get("payment_method"),
                "insurance_provider": args.get("insurance_provider"),
                "total_fee": args.get("total_fee") or args.get("total_price"),
                "source": "vapi_voice_agent"
            }
            requests.post(EXTERNAL_BACKEND_URL, json=forward_payload, timeout=5)
            print(f" Booking forwarded to {EXTERNAL_BACKEND_URL}")
        except Exception as e:
            print(f" Failed to forward booking: {str(e)}")


@app.post("/webhook/booking")
async def handle_booking(request: Request, background_tasks: BackgroundTasks):
    """Receives the LIVE BOOKING tool call from Vapi"""
    body = await request.body()
    if not body:
        return {"status": "error", "message": "Empty request body"}
    
    data = await request.json()

    # For apiRequest tools, Vapi sends the arguments directly in the root or inside 'message'
    if "patient_name" in data or "customer_name" in data:
        # This is a flat apiRequest tool call
        args = data
        business_id = "Dashboard Tool"
        assistant_id = "Unknown"
        import json
        formatted_details = parse_and_format_booking_details(args.get("booking_details") or args.get("order_items"), args.get("total_fee") or args.get("total_price"))
        print(f"\n--- 🏥 NEW BOOKING RECEIVED for {business_id} ---")
        print(f"Patient: {args.get('patient_name') or args.get('customer_name')}")
        print(f"Age: {args.get('patient_age')}")
        print(f"Phone: {args.get('patient_phone')}")
        print(f"Services (Raw): {args.get('booking_details') or args.get('order_items')}")
        print(f"Services (Structured JSON): {json.dumps({'booking_details': formatted_details}, indent=2)}")
        print(f"Preferred Date: {args.get('preferred_date')}")
        print(f"Preferred Time: {args.get('preferred_time')}")
        print(f"Visit Type: {args.get('visit_type')}")
        print(f"Payment: {args.get('payment_method')}")
        print(f"Total Fee: ${args.get('total_fee') or args.get('total_price')}")
        print("-------------------------------------------\n")

        # Forward in background to avoid blocking Vapi
        background_tasks.add_task(forward_booking_task, business_id, assistant_id, args)

        # Return explicit instructions to the LLM
        return {
            "status": "success", 
            "result": "Booking saved successfully. Reception has received the appointment details. Immediately inform the patient their booking is confirmed and politely say goodbye to end the call."
        }

    else:
        # This is a Vapi Server tool call
        message = data.get("message", {})
        
        # Extract assistant ID from the server tool payload
        call_data = message.get("call", {})
        assistant_id = call_data.get("assistantId", "Unknown")
        
        # Vapi might send 'toolCalls' or 'toolWithToolCallList' depending on the API version
        tool_calls = message.get("toolCalls", [])
        if not tool_calls and "toolWithToolCallList" in message:
            for item in message.get("toolWithToolCallList", []):
                if "toolCall" in item:
                    tool_calls.append(item["toolCall"])
        
        results = []
        for tool_call in tool_calls:
            args = tool_call.get("function", {}).get("arguments", {})
            
            # OpenAI/Vapi often send arguments as a JSON string
            if isinstance(args, str):
                import json
                try:
                    args = json.loads(args)
                except Exception:
                    args = {}
            business_id = message.get("customer", {}).get("metadata", {}).get("business_id", "Unknown")

            import json
            formatted_details = parse_and_format_booking_details(args.get("booking_details") or args.get("order_items"), args.get("total_fee") or args.get("total_price"))
            print(f"\n--- 🏥 NEW BOOKING RECEIVED for {business_id} ---")
            print(f"Assistant ID: {assistant_id}")
            print(f"Patient: {args.get('patient_name') or args.get('customer_name')}")
            print(f"Age: {args.get('patient_age')}")
            print(f"Phone: {args.get('patient_phone')}")
            print(f"Services (Raw): {args.get('booking_details') or args.get('order_items')}")
            print(f"Services (Structured JSON): {json.dumps({'booking_details': formatted_details}, indent=2)}")
            print(f"Preferred Date: {args.get('preferred_date')}")
            print(f"Preferred Time: {args.get('preferred_time')}")
            print(f"Visit Type: {args.get('visit_type')}")
            print(f"Payment: {args.get('payment_method')}")
            print(f"Total Fee: ${args.get('total_fee') or args.get('total_price')}")
            print("-------------------------------------------\n")

            # Forward in background to avoid blocking Vapi
            background_tasks.add_task(forward_booking_task, business_id, assistant_id, args)

            # Return explicit instructions to the LLM
            results.append({
                "toolCallId": tool_call.get("id"),
                "result": "Booking saved successfully. Reception has received the appointment details. Immediately inform the patient their booking is confirmed and politely say goodbye to end the call."
            })
            
        return {"results": results}

@app.post("/webhook/summary")
async def handle_summary(request: Request):
    """Receives the POST-CALL summary from Vapi"""
    data = await request.json()
    
    message = data.get("message", {})
    msg_type = data.get("type") or message.get("type")
    
    # Only process 'end-of-call-report' or 'status-update' that actually has a summary
    call_data = message.get("call", data.get("call", {}))
    analysis = call_data.get("analysis", {})
    summary = analysis.get("summary")

    if not summary:
        return {"status": "ignored", "reason": "no summary in this packet"}

    business_id = call_data.get("metadata", {}).get("business_id", "Unknown")
    structured_data = analysis.get("structuredData")

    print(f"\n--- 📋 FINAL CALL SUMMARY for {business_id} ---")
    print(f"AI Summary: {summary}")
    if structured_data:
        import json
        print(f"Structured Data: {json.dumps(structured_data, indent=2)}")
    print(f"Transcript Snippet: {call_data.get('transcript', '')[:100]}...")
    print("------------------------------------------\n")

    return {"status": "received"}


@app.post("/api/webhook/vapi")
async def vapi_tool_fallback(request: Request, background_tasks: BackgroundTasks):
    """Central Webhook Router for Vapi (Receives Tools, Summaries, and Status Updates)"""
    try:
        data = await request.json()
    except Exception:
        return {"status": "error", "message": "Invalid JSON"}

    message = data.get("message", {})
    msg_type = message.get("type", data.get("type", ""))

    if msg_type == "tool-calls" or "toolCalls" in message or "toolWithToolCallList" in message or "patient_name" in data or "customer_name" in data:
        # Route to Booking Logic
        return await handle_booking(request, background_tasks)
    elif msg_type in ["end-of-call-report", "status-update", "hang-up"]:
        # Route to Summary Logic
        return await handle_summary(request)
    else:
        return {"status": "ignored", "reason": f"Unhandled message type: {msg_type}"}


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
