const supportedSources = ['whatsapp', 'booking_com', 'airbnb', 'instagram', 'direct'];

const validateTimestamp = (timestamp) => {
  if (!timestamp) {
    return false;
  }
  const parsed = Date.parse(timestamp);
  return !Number.isNaN(parsed);
};

const buildError = (message) => {
  const error = new Error(message);
  error.status = 400;
  return error;
};

const validatePayload = (req, res, next) => {
  const { source, guest_name, message, timestamp, property_id } = req.body;

  if (!source) {
    return res.status(400).json({
      success: false,
      error: 'source is required'
    });
  }

  if (typeof source !== 'string' || !supportedSources.includes(source.toLowerCase().trim())) {
    return res.status(400).json({
      success: false,
      error: `source must be one of: ${supportedSources.join(', ')}`
    });
  }

  if (!guest_name || typeof guest_name !== 'string' || guest_name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'guest_name is required and must be a non-empty string'
    });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'message is required and must be a non-empty string'
    });
  }

  if (!timestamp || typeof timestamp !== 'string' || !validateTimestamp(timestamp)) {
    return res.status(400).json({
      success: false,
      error: 'timestamp is required and must be a valid ISO 8601 string'
    });
  }

  if (!property_id || typeof property_id !== 'string' || property_id.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'property_id is required and must be a non-empty string'
    });
  }

  next();
};

export default validatePayload;
