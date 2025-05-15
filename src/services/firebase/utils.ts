import { Timestamp } from "firebase/firestore";

export function removeUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      value !== undefined ? [key, value] : [key, null]
    )
  );
}

export const toDatestring = (date?: Timestamp) => {
  return date?.toDate().toLocaleDateString() || "in progress!";
};
