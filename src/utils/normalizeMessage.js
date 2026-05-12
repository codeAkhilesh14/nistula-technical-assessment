import { v4 as uuidv4 } from 'uuid';

const supportedSources = ['whatsapp', 'booking_com', 'airbnb', 'instagram', 'direct'];

const normalizeSource = (source) => {
  if (!source) return 'direct';
  return source.toString().trim().toLowerCase();
};

const normalizeText = (value) => (value || '').toString().trim();

const normalizeTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  if (!timestamp || Number.isNaN(date.valueOf())) {
    return null;
  }
  return date.toISOString();
};

const validateSource = (source) => supportedSources.includes(source);

export default (payload) => {
  const source = normalizeSource(payload.source);

  if (!validateSource(source)) {
    const error = new Error(`Unsupported source: ${payload.source}`);
    error.status = 400;
    throw error;
  }

  return {
    message_id: uuidv4(),
    source,
    guest_name: normalizeText(payload.guest_name),
    message_text: normalizeText(payload.message),
    timestamp: normalizeTimestamp(payload.timestamp),
    booking_ref: normalizeText(payload.booking_ref),
    property_id: normalizeText(payload.property_id)
  };
};
