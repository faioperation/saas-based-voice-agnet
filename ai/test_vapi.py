import os
import json
import requests
import pandas as pd
from app.extractor import extract_text, generate_clinic_prompt
from app.vapi_client import create_assistant

# 1. Generate Test Assets (Clinic Services & Doctor Information)
print("Generating clinic test assets...")
df = pd.DataFrame({
    "Category": ["Consultation", "Diagnostics", "Diagnostics", "Specialist Consultation"],
    "Service Name": ["General Consultation", "Blood Test (CBC)", "Chest X-Ray", "Cardiology Consultation"],
    "Doctor Name": ["Dr. Smith", "Lab", "Dr. Johnson", "Dr. Williams"],
    "Fee ($)": [50.00, 35.00, 75.00, 120.00],
    "Description": [
        "Routine checkup and general diagnosis",
        "Complete blood count laboratory test",
        "Digital chest radiography scan",
        "Comprehensive heart and vascular evaluation"
    ]
})
df.to_excel("test_services.xlsx", index=False)

rules = """
Business Name: St. Jude Health Clinic
Tone: Extremely friendly, empathetic, and professional healthcare receptionist tone.
Rules: 
- Operating hours: Monday to Friday 8:00 AM - 6:00 PM, Saturday 9:00 AM - 2:00 PM.
- In-person visits and telehealth video consultations available.
- Payment accepted via cash, card, or insurance.
- For emergency medical issues, caller must be transferred to reception immediately.
- If a patient asks for anything not listed in the services, politely explain it is currently unavailable.
"""
with open("test_rules.txt", "w", encoding="utf-8") as f:
    f.write(rules)

# 2. Extract Text
print("Extracting text from clinic files...")
rules_text = extract_text("test_rules.txt")
services_text = extract_text("test_services.xlsx")

# 3. Generate Prompt
prompt = generate_clinic_prompt("TEST-CLINIC-001", rules_text, services_text, business_name="St. Jude Health Clinic")
print("Clinic System Prompt Generated successfully. Snippet:")
print(prompt[:300] + "...\n")

# 4. Call Vapi
print("Calling Vapi to provision the clinic agent...")
try:
    response = create_assistant("TEST-CLINIC-001", prompt, business_name="St. Jude Health Clinic")
    print("\nSUCCESS! Clinic Assistant created on Vapi.")
    print("Assistant ID:", response.get("id"))
    print("\nYou can now check your Vapi Dashboard. You should see a new assistant named 'TEST-CLINIC-001'.")
except requests.exceptions.HTTPError as e:
    print("\nFAILED to create clinic assistant.")
    print("HTTP Error:", e)
    print("Vapi Response Body:", e.response.text)
except Exception as e:
    print("\nFAILED to create clinic assistant.")
    print("Error:", str(e))
