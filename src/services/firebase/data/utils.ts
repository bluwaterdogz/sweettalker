import { QueryBuilder } from "./query";

export async function batchQueryByIn<T>(
  values: string[],
  buildQueryBuilder: (batch: string[]) => QueryBuilder,
  fetcher: (queryBuilder: QueryBuilder) => Promise<T[]>
): Promise<T[]> {
  const BATCH_SIZE = 10;
  const batches: Promise<T[]>[] = [];

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const chunk = values.slice(i, i + BATCH_SIZE);
    const queryBuilder = buildQueryBuilder(chunk);
    batches.push(fetcher(queryBuilder));
  }

  const results = await Promise.all(batches);
  return results.flat();
}
