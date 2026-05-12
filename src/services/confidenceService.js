const clampScore = (value) => Math.min(1, Math.max(0, value));

export const calculateConfidence = (normalized, queryType) => {
  let score = 0.7;

  switch (queryType) {
    case 'complaint':
      score = 0.45;
      break;
    case 'pre_sales_availability':
    case 'pre_sales_pricing':
      score = 0.92;
      break;
    case 'post_sales_checkin':
      score = 0.75;
      break;
    case 'special_request':
      score = 0.7;
      break;
    case 'general_enquiry':
    default:
      score = 0.65;
      break;
  }

  const requiredFields = ['guest_name', 'message_text', 'timestamp', 'property_id'];
  requiredFields.forEach((field) => {
    if (!normalized[field]) {
      score -= 0.1;
    }
  });

  const ambiguousWords = ['maybe', 'perhaps', 'not sure', 'could', 'would', 'possibly'];
  const normalizedText = (normalized.message_text || '').toLowerCase();
  if (ambiguousWords.some((word) => normalizedText.includes(word))) {
    score -= 0.05;
  }

  if (score < 0.05) {
    score = 0.05;
  }

  return Number(clampScore(score).toFixed(2));
};
