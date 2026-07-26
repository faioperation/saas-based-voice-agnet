# FireVoice - Knowledge-Driven Voice Agent (Clinic & Hospital Niche)

This repository contains the multi-tenant Artificial Intelligence core engine for **FireVoice**, a Knowledge-Driven Voice Agent for Clinics, Hospitals, and Medical Centres. It serves as the intelligent middle layer between **Vapi** (AI Voice Assistant Orchestration), **Twilio** (Telephony), and **OpenAI** (LLM & Document Extraction).

---

## 🏗️ Architecture & How It Works

### 1. Clinic Document Ingestion (`POST /api/agents/create`)
When a clinic or hospital onboard, they upload:
* **Rules File (`rules_file`)**: Text/PDF/DOCX containing operating policies, hours, emergency protocols, and clinic guidelines.
* **Services File (`services_file`)**: Excel/PDF/CSV containing service names, doctor names, fees ($), and descriptions.
* **FireVoice Engine**:
  * Extracts text via `app/extractor.py`.
  * Auto-extracts clinic profile name and details.
  * Dynamically generates a clinical persona (`clinic_system_prompt.txt`).
  * Provisions/updates a Vapi AI Voice Assistant and links webhook callback URLs.

### 2. Telephony Linking (`POST /api/telephony/link`)
Links a Twilio phone number directly to a specific clinic's Vapi assistant and registers escalation phone numbers for reception/front-desk transfers.

### 3. Voice Call Handling & Tool Execution
When a patient dials the clinic number:
* **FireVoice Assistant** greets the caller warmly: *"Hi, you're through to [Clinic Name] and I'm FireVoice, their virtual assistant. How can I help you today?"*
* Handles inquiries regarding services, doctors, pricing ($ USD), clinic hours, and visit options (in-person vs. telehealth).
* Collects patient booking details: Full Name, Age, Phone Number, Preferred Date & Time, Visit Type, and Payment Method (Cash, Card, or Insurance).
* Triggers the `save_booking` tool to log appointment data to the backend.
* Handles instant call escalation to reception for medical emergencies, complaints, or card payment transfers.

---

## 📡 API Endpoints (FastAPI)

* `POST /api/agents/create`: Upload clinic rules & services document to provision/update a Vapi assistant.
* `PATCH /api/agents/services`: Update the services list and fees for an existing Vapi assistant.
* `POST /api/telephony/link`: Link a Twilio phone number to a Vapi assistant ID.
* `DELETE /api/telephony/unlink/{phone_number_id}`: Remove phone number link.
* `POST /webhook/booking`: Webhook target for live appointment booking tool calls.
* `POST /webhook/summary`: Webhook target for post-call transcripts & AI summaries.
* `POST /api/webhook/vapi`: Central Vapi event router webhook.

---

## 🚀 Setup & Local Execution

1. **Environment Setup**:
   Copy `.env.example` (or configure `.env`) with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_key
   LLM_MODEL=gpt-4o
   VAPI_API_KEY=your_vapi_api_key
   VAPI_PUBLIC_KEY=your_vapi_public_key
   VAPI_DEFAULT_TOOL_ID=your_tool_id
   VAPI_SERVER_URL=https://your-ngrok-domain.ngrok-free.dev/api/webhook/vapi
   TWILIO_ACCOUNT_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_token
   ```

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Run Test Provisioning Script**:
   ```bash
   python test_vapi.py
   ```
