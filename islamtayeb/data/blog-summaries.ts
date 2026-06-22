export const blogSummaries: Record<string, string> = {
  'agent-self-reflection':
    'Whether agents should explain decisions before, during, or after acting.',
  'batch-agent-sdk-research-overview':
    'Research notes on batch workflows around agent SDKs.',
  'effect-of-explanation-and-confidence-fields-on-llm-extraction':
    'Testing whether extra fields change LLM extraction quality.',
  'frontier-benchmarking':
    'Frontier-model canaries for deciding if a systems idea still matters.',
  hydra: 'Async checking and rollback for LLM code generation over Clang.',
  'multi-agents':
    'Scratch notes on when many agents help and when they get noisy.',
  'on-agent-memory-fidelity':
    'Why agent context should be structured, summarized, and selectively hidden.',
  'on-closing-doors':
    'On uncertainty, optionality, and the cost of keeping every path open.',
  'on-dimensions-of-taste':
    'Trying to model personal music taste as something measurable.',
  'on-fingerspitzengefuhl':
    'On osu!, rhythm-game intuition, and skill felt before it is named.',
  'on-using-computers':
    'A note on shortcuts, computers, and the urge to optimize everything.',
  'typhon-260515':
    'Notes on LLM code failures and stronger generation systems.',
};

export function getBlogSummary(slug: string) {
  const summary = blogSummaries[slug];

  if (!summary) {
    throw new Error(`Missing blog summary for ${slug}`);
  }

  return summary;
}
