# Nistula Technical Assessment Thinking

## A. Immediate response to an angry guest
When a guest is angry, the immediate approach should be empathetic, concise, and reassuring. A professional reply should acknowledge the issue, apologize for the inconvenience, and provide a near-term action plan. For example:

"Hello Rahul, I am sorry to hear about your experience. I appreciate you raising this immediately. I am checking the situation with our team and will follow up within the next 30 minutes with a resolution." 

This response signals attention, ownership, and urgency, while avoiding defensiveness.

## B. Full system escalation workflow
A complete escalation workflow begins with automated classification, confidence scoring, and routing. The system should classify the incoming message, generate an AI draft, and calculate an action recommendation. If the message is a complaint or the confidence score is low, the workflow escalates to a human agent.

Steps:
1. Ingest webhook payload and validate it.
2. Normalize the message and classify query type.
3. Enrich with property context and request an AI draft.
4. Compute confidence and determine action.
5. Auto-send only when the AI reply is strong.
6. For complaints or low confidence, notify a human agent and persist the conversation.
7. Track resolution status, agent edits, and follow-up deadlines.

This ensures the system balances automation with reliability and customer satisfaction.

## C. Learning from repeated complaints
Repeated complaints should trigger feedback loops across operations and product teams. At the system level, aggregate complaint data by category, frequency, and property. Highlight patterns such as recurring housekeeping issues, late check-ins, or communication gaps.

A product-focused learning loop should include:
- Capturing complaint metadata and classification.
- Reviewing recurring themes weekly.
- Adjusting staff workflows, messaging scripts, or property policies.
- Measuring impact through reduced complaint frequency.

By treating repeated complaints as signals rather than noise, the team can improve service quality and reduce future escalations.
