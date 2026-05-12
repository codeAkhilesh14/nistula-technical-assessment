# Nistula Technical Assessment Backend

A production-style Node.js + Express backend for receiving hospitality guest messages, normalizing incoming payloads, classifying query intent, enriching requests with property context, and generating professional AI responses using the Anthropic Claude API.

---

## Features

- Receives guest messages through `POST /webhook/message`
- Normalizes webhook payloads into a unified schema
- Classifies query type using keyword-based rules
- Sends property context and guest query to the Claude API
- Returns a hospitality-focused AI drafted reply
- Computes a confidence score and action recommendation
- Includes request validation and centralized error handling

---

## Tech Stack

- Node.js
- Express.js
- Anthropic Claude API
- Axios
- UUID
- dotenv
- Nodemon

---

## Folder Structure

```txt
nistula-technical-assessment/
├── package.json
├── .gitignore
├── .env.example
├── README.md
├── schema.sql
├── thinking.md
└── src/
    ├── server.js
    ├── routes/
    │   └── messageRoutes.js
    ├── controllers/
    │   └── messageController.js
    ├── services/
    │   ├── classifyService.js
    │   ├── claudeService.js
    │   └── confidenceService.js
    ├── utils/
    │   ├── normalizeMessage.js
    │   └── actionHelper.js
    ├── data/
    │   └── propertyContext.js
    └── middleware/
        └── validatePayload.js
```

---

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd nistula-technical-assessment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment variables file

Copy the example environment file:

```bash
cp .env.example .env
```

### 4. Add your Claude API key

Inside `.env`:

```env
CLAUDE_API_KEY=your_claude_api_key_here
PORT=4000
```

### 5. Start the development server

```bash
npm run dev
```

The server will start on:

```txt
http://localhost:4000
```

---

## Environment Variables

The application expects the following environment variables:

| Variable | Description |
|---|---|
| `CLAUDE_API_KEY` | Anthropic Claude API key |
| `PORT` | Optional server port |

---

## API Endpoint

### POST `/webhook/message`

Receives a guest webhook payload and returns:
- normalized message
- query classification
- AI-generated reply
- confidence score
- recommended action

---

## Request Payload Example

```json
{
  "source": "whatsapp",
  "guest_name": "Rahul Sharma",
  "message": "Is the villa available from April 20 to 24? What is the rate for 2 adults?",
  "timestamp": "2026-05-05T10:30:00Z",
  "booking_ref": "NIS-2024-0891",
  "property_id": "villa-b1"
}
```

---

## Response Example

```json
{
  "message_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
  "query_type": "pre_sales_availability",
  "drafted_reply": "Hello Rahul, thank you for your inquiry. Villa B1 is available from April 20 to 24 at INR 18,000 per night for up to 4 guests, with an additional INR 2,000 per night per extra guest. Check-in is at 2pm and check-out is at 11am. Please let me know if you'd like me to reserve those dates for you.",
  "confidence_score": 0.92,
  "action": "auto_send"
}
```

---

## Supported Query Types

- `pre_sales_availability`
- `pre_sales_pricing`
- `post_sales_checkin`
- `special_request`
- `complaint`
- `general_enquiry`

---

## Confidence Scoring Logic

Confidence is calculated using:
- query type
- required field completeness
- message clarity
- ambiguity level

### Confidence Rules

| Query Type | Confidence |
|---|---|
| complaint | Low |
| pre_sales_availability | High |
| pre_sales_pricing | High |
| post_sales_checkin | Medium |
| ambiguous queries | Lower confidence |

---

## Action Rules

| Action | Condition |
|---|---|
| `auto_send` | Confidence score > 0.85 |
| `agent_review` | Confidence score between 0.60 and 0.85 |
| `escalate` | Confidence score < 0.60 or complaint queries |

---

## Assumptions

- The webhook payload format remains consistent across channels.
- Only a single mocked property (`villa-b1`) is used in this implementation.
- Claude is responsible only for drafting the guest-facing reply.
- The current implementation does not persist data to a database.
- Classification uses lightweight keyword-based logic instead of machine learning.

---

## Error Handling

The backend includes:
- request payload validation
- invalid route handling
- centralized Express error middleware
- Claude API failure handling
- graceful JSON error responses

---

## Future Improvements

- Add PostgreSQL database integration
- Store guests, reservations, conversations, and AI responses
- Add authentication and rate limiting
- Support multiple properties dynamically
- Add retry handling for Claude API failures
- Add Redis caching
- Add unit and integration tests
- Add monitoring and logging support

---

## Manual Testing

The API was manually tested using Postman with multiple scenarios:

1. Availability and pricing enquiry
2. Complaint escalation flow
3. Check-in and WiFi enquiry
4. Invalid payload validation

All test cases returned the expected:
- query classification
- confidence score
- action recommendation
- AI-generated response

---

## Run Scripts

### Development mode

```bash
npm run dev
```

### Production mode

```bash
npm start
```

---

## Author

Submitted for the Nistula Summer Technology Internship 2026 Technical Assessment.
