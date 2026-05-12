export const resolveAction = (confidenceScore, queryType) => {
  if (queryType === 'complaint' || confidenceScore < 0.6) {
    return 'escalate';
  }

  if (confidenceScore > 0.85) {
    return 'auto_send';
  }

  return 'agent_review';
};
