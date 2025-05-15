export function safeJsonParseGPT<T>(responseText: string): T[] | null {
  try {
    // Try direct JSON parse first
    const direct = JSON.parse(responseText);
    if (Array.isArray(direct)) return direct;
  } catch (error) {}
  // Extract content between first "[" and last "]"
  const startIdx = responseText.indexOf("[");
  const endIdx = responseText.lastIndexOf("]");
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;

  const sliced = responseText.slice(startIdx, endIdx + 1);

  try {
    const parsed = JSON.parse(sliced);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
}
