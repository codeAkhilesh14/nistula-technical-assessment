import axios from 'axios';

const CLAUDE_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

const getApiKey = () => {
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    const error = new Error('Missing Claude API key in environment variables');
    error.status = 500;
    throw error;
  }
  return apiKey;
};

const buildSystemPrompt = () =>
  'You are a professional hospitality assistant. Use a warm, concise, and helpful tone. Provide a guest-facing response only. Do not include any internal notes or metadata.';

const buildUserMessage = (normalized, propertyContext) => ({
  role: 'user',
  content: `Property details:\n${propertyContext}\n\nGuest request:\nSource: ${normalized.source}\nGuest name: ${normalized.guest_name}\nBooking reference: ${normalized.booking_ref || 'N/A'}\nProperty ID: ${normalized.property_id}\nMessage: ${normalized.message_text}\n\nReply:`
});

const extractResponseText = (data) => {
  const getText = (item) => {
    if (!item || typeof item !== 'object') return null;
    if (typeof item.text === 'string') return item.text;
    if (item.type === 'output_text' && typeof item.text === 'string') return item.text;
    return null;
  };

  const extractFromContent = (content) => {
    if (!Array.isArray(content)) return null;
    for (const item of content) {
      const text = getText(item);
      if (text) return text;
    }
    return null;
  };

  if (Array.isArray(data?.completion)) {
    for (const completionItem of data.completion) {
      const text = extractFromContent(completionItem?.content) || getText(completionItem);
      if (text) return text;
    }
  }

  if (data?.completion && typeof data.completion === 'object') {
    const text = extractFromContent(data.completion.content) || getText(data.completion);
    if (text) return text;
  }

  if (Array.isArray(data?.content)) {
    const text = extractFromContent(data.content);
    if (text) return text;
  }

  if (typeof data?.content === 'string') return data.content;
  if (typeof data?.output_text === 'string') return data.output_text;
  if (typeof data?.text === 'string') return data.text;
  return null;
};

export const craftClaudeReply = async (normalized, propertyContext) => {
  const apiKey = getApiKey();
  const system = buildSystemPrompt();
  const messages = [buildUserMessage(normalized, propertyContext)];

  try {
    const response = await axios.post(
      CLAUDE_ENDPOINT,
      {
        model: MODEL,
        system,
        messages,
        max_tokens: 300,
        temperature: 0.2
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const responseText = extractResponseText(response.data);
    if (!responseText) {
      const error = new Error('Unexpected response from Claude API');
      error.status = 502;
      throw error;
    }

    return responseText.trim();
  } catch (err) {
    if (err.response && err.response.data) {
      const responseData = err.response.data;
      const apiError = responseData.error ?? responseData;
      const messageText =
        apiError?.message ||
        apiError?.error ||
        (typeof apiError === 'string' ? apiError : null) ||
        JSON.stringify(responseData);

      const error = new Error(`Claude API error: ${messageText}`);
      error.status = err.response.status || 502;
      throw error;
    }

    const error = new Error(err.message || 'Failed to call Claude API');
    error.status = err.status || 502;
    throw error;
  }
};
