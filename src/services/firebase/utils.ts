export function removeUndefined(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      value !== undefined ? [key, value] : [key, null]
    )
  );
}
