import { format } from "date-fns";
import { isEqual } from "lodash";
import { Timestamp } from "firebase/firestore";

export function mapToOption<V = string>(
  enumType: Record<string, V>
): { value: V; label: string }[] {
  return Object.entries(enumType).map(([key, value]) => ({
    label: key,
    value: value,
  }));
}

export function formatDate(
  date: Date,
  formatString: string = "MMM d, yyyy h:mm a"
): string {
  if (date == null) {
    return "";
  }
  return format(date, formatString);
}

export function formatTimeStamp(
  timestamp: Timestamp,
  formatString?: string
): string {
  if (timestamp == null) {
    return "";
  }
  const date = new Date(timestamp.seconds * 1000);
  return formatDate(date, formatString);
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export function diffObjects<T extends Record<string, any>>(
  obj1: T,
  obj2: T
): Partial<T> {
  const diff = {} as Partial<T>;

  for (const key in obj2) {
    const val1 = obj1?.[key];
    const val2 = obj2[key];

    if (
      typeof val2 === "object" &&
      val2 !== null &&
      !Array.isArray(val2) &&
      typeof val1 === "object" &&
      val1 !== null
    ) {
      const nestedDiff = diffObjects(val1, val2);
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff as T[typeof key];
      }
    } else if (val1 !== val2) {
      diff[key] = val2;
    }
  }

  return diff;
}
