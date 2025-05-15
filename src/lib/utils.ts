import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";

export function mapToOption(enumType: any): { value: string; label: string }[] {
  return Object.entries(enumType).map(([key, value]) => ({
    label: key,
    value: value as string,
  }));
}

export function formatDate(date: Timestamp): string {
  if (date == null) {
    return "";
  }
  return format(new Date(date.seconds * 1000), "MMM d, yyyy h:mm a");
}
