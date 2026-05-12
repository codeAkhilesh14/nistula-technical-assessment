# Nistula Technical Assessment Backend

A production-style Node.js + Express backend for receiving hospitality guest messages, normalizing incoming payloads, classifying query intent, enriching the request with property context, and generating professional AI responses via the Anthropic Claude API.

## Features

- Receives guest messages through `POST /webhook/message`
- Normalizes webhook payloads into a unified schema
- Classifies query type using keyword-based rules
- Sends context and guest query to the Claude API
- Returns a hospitality-focused AI draft reply
- Computes a confidence score and action recommendation
- Includes validation and centralized error handling

## Folder structure

```
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

## Installation

1. Clone or download the repository.
2. Install dependencies:

```bash
npm install
```

3. Copy the environment template:

```bash
cp .env.example .env
```

4. Add your Claude API key in `.env`:

```env
CLAUDE_API_KEY=sk-...
PORT=4000
```

5. Start the app:

```bash
npm run dev
```

## Environment setup

The app expects the following environment variables:

- `CLAUDE_API_KEY` - your Anthropic Claude API key
- `PORT` - optional server port (defaults to `4000`)

## API endpoint

### POST /webhook/message

Accepts a guest webhook payload and returns a normalized response with AI-generated draft text, confidence score, and action recommendation.

### Request payload example

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

### Response example

```json
{
  "message_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
  "query_type": "pre_sales_availability",
  "drafted_reply": "Hello Rahul, thank you for your inquiry. Villa B1 is available from April 20 to 24 at INR 18,000 per night for up to 4 guests, with an additional INR 2,000 per night per extra guest. Check-in is at 2pm and check-out is at 11am. Please let me know if you'd like me to reserve those dates for you.",
  "confidence_score": 0.92,
  "action": "auto_send"
}
```

## Confidence scoring

Confidence is calculated using the query type, required field completeness, and message clarity.

- `complaint`: low confidence
- `pre_sales_availability` / `pre_sales_pricing`: high confidence
- `post_sales_checkin`: moderate confidence
- missing or ambiguous fields lower the score

### Action rules

- `auto_send` when score > 0.85
- `agent_review` when score is between 0.60 and 0.85
- `escalate` when score < 0.60 or the query type is `complaint`

## Assumptions

- The webhook schema is consistent with the provided sample payload.
- Only a single property context is required for `villa-b1`.
- Claude is used to draft only the reply text, and the backend returns the text directly.
- This implementation does not persist data to a database by default.

## Future improvements

- Add database persistence for guests, reservations, conversations, messages, and AI responses.
- Implement retries and circuit breakers for Claude API calls.
- Add request authentication and rate limiting.
- Support multiple properties and dynamic property context.
- Add comprehensive unit and integration tests.
