export function mapToOption(enumType: any): { value: string; label: string }[] {
  return Object.entries(enumType).map(([key, value]) => ({
    label: key,
    value: value as string,
  }));
}
