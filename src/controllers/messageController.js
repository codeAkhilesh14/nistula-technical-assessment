import normalizeMessage from '../utils/normalizeMessage.js';
import { classifyQueryType } from '../services/classifyService.js';
import { craftClaudeReply } from '../services/claudeService.js';
import { calculateConfidence } from '../services/confidenceService.js';
import { resolveAction } from '../utils/actionHelper.js';
import { getPropertyContext } from '../data/propertyContext.js';

export const handleMessage = async (req, res, next) => {
  try {
    const normalized = normalizeMessage(req.body);
    const queryType = classifyQueryType(normalized.message_text);
    normalized.query_type = queryType;

    const propertyContext = getPropertyContext(normalized.property_id);

    const draftedReply = await craftClaudeReply(normalized, propertyContext);
    const confidenceScore = calculateConfidence(normalized, queryType);
    const action = resolveAction(confidenceScore, queryType);

    return res.status(200).json({
      message_id: normalized.message_id,
      query_type: queryType,
      drafted_reply: draftedReply,
      confidence_score: confidenceScore,
      action
    });
  } catch (error) {
    next(error);
  }
};
