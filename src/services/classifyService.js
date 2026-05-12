const AVAILABLE_KEYWORDS = ['available', 'availability', 'vacancy', 'open', 'free', 'book', 'booking', 'dates'];
const PRICING_KEYWORDS = ['rate', 'price', 'pricing', 'cost', 'charge', 'fee', 'per night', 'extra guest', 'adult', 'children'];
const CHECKIN_KEYWORDS = ['check in', 'check-in', 'arrival', 'arrive', 'late arrival', 'early arrival', 'room ready', 'keys'];
const SPECIAL_KEYWORDS = ['special', 'request', 'amenities', 'airport transfer', 'chef', 'dietary', 'extra pillows', 'late check-out', 'early check-in'];
const COMPLAINT_KEYWORDS = ['complaint', 'issue', 'problem', 'unhappy', 'not acceptable', 'delay', 'broken', 'dirty', 'noise', 'cancel', 'refund'];

const normalizeText = (text) => (text || '').toLowerCase();

const includesKeyword = (text, keywords) => keywords.some((keyword) => text.includes(keyword));

export const classifyQueryType = (messageText) => {
  const normalized = normalizeText(messageText);

  if (includesKeyword(normalized, COMPLAINT_KEYWORDS)) {
    return 'complaint';
  }

  if (includesKeyword(normalized, SPECIAL_KEYWORDS)) {
    return 'special_request';
  }

  if (includesKeyword(normalized, CHECKIN_KEYWORDS)) {
    return 'post_sales_checkin';
  }

  const hasAvailability = includesKeyword(normalized, AVAILABLE_KEYWORDS);
  const hasPricing = includesKeyword(normalized, PRICING_KEYWORDS);

  if (hasAvailability && !hasPricing) {
    return 'pre_sales_availability';
  }

  if (hasPricing && !hasAvailability) {
    return 'pre_sales_pricing';
  }

  if (hasAvailability && hasPricing) {
    return 'pre_sales_availability';
  }

  return 'general_enquiry';
};
