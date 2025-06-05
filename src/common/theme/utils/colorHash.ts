/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Maps any input string to a consistent color from the provided color list
 * @param input - The string to hash (e.g., user ID, name, etc.)
 * @param colors - Array of colors to choose from
 * @returns A color from the provided array
 */
export function getColorFromHash(input: string, colors: string[]): string {
  if (!colors.length) {
    throw new Error("Color array must not be empty");
  }
  return colors[hashString(input) % colors.length];
}
