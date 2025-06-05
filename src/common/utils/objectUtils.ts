/**
 * Safely retrieves a value from an object using a dot-notation path
 * @param obj The object to access
 * @param path The dot-notation path (e.g. "user.profile.name")
 * @param defaultValue The value to return if the path doesn't exist
 * @returns The value at the path or the default value
 */
export const getNestedValue = <T = any>(
  obj: any,
  path: string,
  defaultValue: T = undefined as T
): T => {
  if (!obj || !path) return defaultValue;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) return defaultValue;
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
};
