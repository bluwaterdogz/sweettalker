// subscriptionCache.ts (enhanced for both batched and normal queries)
import { where, orderBy, query } from "firebase/firestore";
import { QueryBuilder } from "@/services/firebase/data/query";

interface Subscriber<T> {
  callback: (data: T[]) => void;
  unsubscribe: () => void;
}

export class SubscriptionCache<T> {
  private cache = new Map<string, Subscriber<T>[]>();

  subscribe(
    key: string,
    createSubscription: (onData: (data: T[]) => void) => () => void,
    onData: (data: T[]) => void
  ): () => void {
    let subscribers = this.cache.get(key);

    if (!subscribers) {
      subscribers = [];
      this.cache.set(key, subscribers);

      const unsubscribe = createSubscription((data) => {
        const activeSubscribers = this.cache.get(key) || [];
        activeSubscribers.forEach((sub) => sub.callback(data));
      });

      subscribers.push({ callback: onData, unsubscribe });
    } else {
      subscribers.push({ callback: onData, unsubscribe: () => {} });
    }

    return () => this.unsubscribe(key, onData);
  }

  unsubscribe(key: string, callback: (data: T[]) => void): void {
    const subscribers = this.cache.get(key);
    if (!subscribers) return;

    const remaining = subscribers.filter((sub) => sub.callback !== callback);

    if (remaining.length === 0) {
      subscribers[0]?.unsubscribe();
      this.cache.delete(key);
    } else {
      this.cache.set(key, remaining);
    }
  }
}

// batchSubscribeByIn.ts

export async function batchSubscribeByIn<T>(
  values: string[],
  field: string,
  basePath: string,
  firebaseSubscribe: (
    path: string,
    onData: (results: T[]) => void,
    queryBuilder: QueryBuilder
  ) => () => void,
  onData: (combinedResults: T[]) => void,
  cache: SubscriptionCache<T>
): Promise<() => void> {
  const BATCH_SIZE = 10;
  const unsubscribers: (() => void)[] = [];
  const resultMap = new Map<string, T>();

  const emitAllResults = () => {
    onData(Array.from(resultMap.values()));
  };

  for (let i = 0; i < values.length; i += BATCH_SIZE) {
    const batch = values.slice(i, i + BATCH_SIZE);
    const key = JSON.stringify({
      type: "batched",
      basePath,
      field,
      values: batch,
    });

    const unsubscribe = cache.subscribe(
      key,
      (notifySubscribers) => {
        return firebaseSubscribe(
          basePath,
          (results) => {
            results.forEach((item: any) => resultMap.set(item.id, item));
            notifySubscribers(Array.from(resultMap.values()));
          },
          (ref) =>
            query(ref, where(field, "in", batch), orderBy("createdAt", "desc"))
        );
      },
      emitAllResults
    );

    unsubscribers.push(() => cache.unsubscribe(key, emitAllResults));
  }

  return () => unsubscribers.forEach((stop) => stop());
}

// subscribeWithCache.ts

export function subscribeWithCache<T>(
  cache: SubscriptionCache<T>,
  keyParams: object,
  firebaseSubscribe: (
    path: string,
    onData: (results: T[]) => void,
    queryBuilder: QueryBuilder
  ) => () => void,
  path: string,
  builder: QueryBuilder,
  onData: (results: T[]) => void
): () => void {
  const key = JSON.stringify({ type: "normal", ...keyParams });

  return cache.subscribe(
    key,
    (notifySubscribers) => {
      return firebaseSubscribe(
        path,
        (results) => notifySubscribers(results),
        builder
      );
    },
    onData
  );
}
