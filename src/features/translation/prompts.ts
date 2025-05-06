export const generatePromptGPT3_5 = (
  identifiers: string,
  extraContext: string,
  userMessage: string,
  userInstructions: string
) => `
You are an expert in the following communication methods:
${identifiers}

Rewrite the emotional message below in 3 brief versions. Each version should:
- Express the speaker's emotional truth clearly and fully
- Be kind, non-blaming, and emotionally vulnerable
- Reduce conflict and keep the listener open
- Be curious and respoectful about the listener's perspective and emotions
- Can be coloquial if appropriate , and hsould be warm but gramatically correct
- Most importantly Increase emotional intimacy, vulnerability, emotional safety, and mutual understanding
${userInstructions ? `it should also be ${userInstructions}` : ""}

${
  extraContext
    ? `additional context about the conversation: ${extraContext}`
    : ""
}

Limit each version to 2-3 sentences.
Label each version with the communication method used.
Respond only with the 3 labeled versions. No explanations.

Message: ${userMessage}

Return only a valid JSON array of 3 items. Each must be an object with:
- "modality": the method used
- "text": the rewritten message
- "description": a description of why this response is more effective
Start with [ and end with ]. No extra text.
`;

export const generatePromptGPT4 = (
  identifiers: string,
  extraContext: string,
  userMessage: string,
  userInstructions: string
) => `
You are a specialist in the following relational communication methods:
${identifiers}

Rewrite the emotional message below in 3 alternate versions.

Each version should:
- Convey the speaker's emotional truth with honesty and vulnerability
- Be kind, emotionally attuned, and non-blaming
- De-escalate conflict and reduce defensiveness
- Be curious and respectful about the listener's perspective and emotions
- Most importantly Increase emotional intimacy, vulnerability, emotional safety, and mutual understanding between the people involved
${userInstructions ? `it should also be ${userInstructions}` : ""}

${extraContext ? `additional conversation context: ${extraContext}` : ""}

Keep each version brief (2-3 sentences). Label each with the communication method used.
Do not explain or narrate—only output the 3 labeled versions.

Message: ${userMessage}

Respond with a JSON array of 3 objects: each with "modality" and "text" and "description", a description of why this response is more effective. No explanation.
`;
