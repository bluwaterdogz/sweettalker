import { WhereCondition } from "@/services/firebase/data/query";

export function optionalWhereIn(list?: any[]): WhereCondition[] | undefined {
  return list != null && list.length > 0
    ? [
        {
          field: "__name__",
          operator: "in",
          value: list || [],
        },
      ]
    : undefined;
}
