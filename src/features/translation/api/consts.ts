export const unsafePatterns = [
  {
    pattern: /(?:i(?:'| a)m going to kill|hurt|hit|destroy|punch)/i,
    reason: "Threat of physical violence",
  },
  {
    pattern:
      /(?:you(?:'| a)re a (?:monster|bitch|whore|idiot|stupid|worthless))/i,
    reason: "Abusive name-calling",
  },
  {
    pattern: /(?:i hate you|i wish you were dead)/i,
    reason: "Extreme emotional abuse",
  },
  {
    pattern: /(?:i(?:'| a)m worthless|want to die)/i,
    reason: "Self-harm or suicidal ideation",
  },
  {
    pattern: /(?:sexually abuse|molest|rape|assault)/i,
    reason: "Sexual or physical abuse",
  },
];
