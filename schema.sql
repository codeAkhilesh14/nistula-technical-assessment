-- PostgreSQL schema for Nistula hospitality backend
-- Schema captures guests, reservations, conversations, messages, and AI responses.

CREATE TABLE guests (
  guest_id SERIAL PRIMARY KEY,
  guest_name VARCHAR(255) NOT NULL,
  source VARCHAR(64) NOT NULL,
  booking_ref VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE guests IS 'Stores guest identity and source information for hospitality messaging.';
COMMENT ON COLUMN guests.guest_name IS 'Name of the guest or lead.';
COMMENT ON COLUMN guests.source IS 'Source channel for the inquiry such as whatsapp or airbnb.';

CREATE TABLE reservations (
  reservation_id SERIAL PRIMARY KEY,
  guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  property_id VARCHAR(128) NOT NULL,
  booking_ref VARCHAR(128),
  check_in DATE,
  check_out DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE reservations IS 'Optional reservation metadata associated with a guest.';

CREATE TABLE conversations (
  conversation_id SERIAL PRIMARY KEY,
  guest_id INTEGER NOT NULL REFERENCES guests(guest_id) ON DELETE CASCADE,
  property_id VARCHAR(128) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE conversations IS 'Top-level conversation thread for a guest and property.';

CREATE TABLE messages (
  message_id UUID PRIMARY KEY,
  conversation_id INTEGER NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  source VARCHAR(64) NOT NULL,
  guest_name VARCHAR(255) NOT NULL,
  message_text TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  booking_ref VARCHAR(128),
  property_id VARCHAR(128) NOT NULL,
  query_type VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE messages IS 'Stores normalized guest messages and query intent classification.';
COMMENT ON COLUMN messages.query_type IS 'Query taxonomy used to route responses and action logic.';

CREATE TABLE ai_responses (
  response_id SERIAL PRIMARY KEY,
  message_id UUID NOT NULL REFERENCES messages(message_id) ON DELETE CASCADE,
  confidence_score NUMERIC(3,2) NOT NULL,
  action VARCHAR(32) NOT NULL,
  ai_drafted TEXT NOT NULL,
  auto_sent BOOLEAN NOT NULL DEFAULT FALSE,
  agent_edited BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE ai_responses IS 'Stores AI drafted replies, confidence, and workflow flags.';
COMMENT ON COLUMN ai_responses.auto_sent IS 'True when the response can be sent automatically without manual review.';
COMMENT ON COLUMN ai_responses.agent_edited IS 'True when a human agent modified the AI draft before sending.';

CREATE INDEX idx_guests_booking_ref ON guests(booking_ref);
CREATE INDEX idx_reservations_property_id ON reservations(property_id);
CREATE INDEX idx_messages_property_id ON messages(property_id);
CREATE INDEX idx_messages_query_type ON messages(query_type);
