import { QueryOptions } from "../firebase/data/query";

const MAX_FIRESTORE_IN_CLAUSE = 10;

export async function batchGetList<T>(
  originalQuery: QueryOptions,
  chunkedQueries: QueryOptions[],
  fetchChunk: (chunk: QueryOptions) => Promise<T[]>
): Promise<T[]> {
  const batches = chunkedQueries.map(fetchChunk);
  const results = await Promise.all(batches);
  return results.flat();
}

export function isBatchingRequired(queryOptions?: QueryOptions): boolean {
  return !!queryOptions?.where?.some(
    (cond) =>
      cond.operator === "in" &&
      Array.isArray(cond.value) &&
      cond.value.length > MAX_FIRESTORE_IN_CLAUSE
  );
}

export function createBatchedQueries(
  originalQuery: QueryOptions
): QueryOptions[] {
  const batched: QueryOptions[] = [];

  for (const condition of originalQuery.where || []) {
    if (
      condition.operator === "in" &&
      Array.isArray(condition.value) &&
      condition.value.length > MAX_FIRESTORE_IN_CLAUSE
    ) {
      const chunks = chunkArray(condition.value, MAX_FIRESTORE_IN_CLAUSE);

      for (const chunk of chunks) {
        const newQuery: QueryOptions = {
          ...originalQuery,
          where: originalQuery.where!.map((cond) =>
            cond === condition ? { ...cond, value: chunk } : cond
          ),
        };
        batched.push(newQuery);
      }

      return batched; // Only support batching one "in" clause at a time
    }
  }

  return [originalQuery]; // fallback
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
