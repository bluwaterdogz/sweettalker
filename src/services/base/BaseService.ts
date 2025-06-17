import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { BaseModel } from "@common/models/base/base";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import {
  QueryBuilder,
  QueryBuilderFactory,
  QueryOptions,
} from "@/services/firebase/data/query";
import { batchGetList, createBatchedQueries } from "./batching";
import { isBatchingRequired } from "./batching";
import { Unsubscribe } from "firebase/firestore";
import { subscribeWithCache, SubscriptionCache } from "./caching";

// const subscriptionCache = new SubscriptionCache<any>();

export interface BaseServiceOptions {
  query?: QueryOptions;
  soleQuery?: QueryOptions;
}

export abstract class BaseService<
  T extends BaseModel,
  DTO = any,
  Options = {},
> {
  protected abstract firestoreTag: FirestoreCollections;
  protected abstract mapper(data: any): T;

  protected getDefaultListQueryOptions(): QueryOptions {
    return {};
  }
  protected getPath(
    options?: Options & BaseServiceOptions,
    id?: string
  ): string {
    const basePath = this.getPathPrefix(options);
    const path = id ? `${basePath}/${id}` : basePath;
    return path;
  }

  protected getPathPrefix(options?: Options & BaseServiceOptions): string {
    return this.firestoreTag;
  }

  protected toPersistenceModel(data: any): DTO {
    return data as DTO;
  }

  constructor(protected readonly firebaseService: FirebaseService) {}

  @withErrorHandling({
    errorMessage: (ctx) => `Error getting in ${ctx.constructor.name}`,
  })
  public async get(
    id: string,
    options?: Options & BaseServiceOptions
  ): Promise<T | undefined> {
    const path = this.getPath(options);
    return await this.firebaseService.getDocument<T>(path, id);
  }

  @withErrorHandling({
    errorMessage: (ctx) => `Error getting list in ${ctx.constructor.name}`,
  })
  public async getList(options?: Options & BaseServiceOptions): Promise<T[]> {
    const queryOptions = options?.soleQuery
      ? options.soleQuery
      : QueryBuilderFactory.deepMergeQueryOptions(
          this.getDefaultListQueryOptions(),
          options?.query
        );

    if (isBatchingRequired(queryOptions)) {
      return this.getBatchedList({
        ...options,
        query: queryOptions,
      } as Options & BaseServiceOptions);
    } else {
      const path = this.getPath(options);
      const queryBuilder = this.getQueryBuilder(queryOptions);
      return await this.firebaseService.getDocumentList<T>(path, queryBuilder);
    }
  }

  @withErrorHandling({
    errorMessage: (ctx) =>
      `Error getting batched list in ${ctx.constructor.name}`,
  })
  private getBatchedList(options?: Options & BaseServiceOptions): Promise<T[]> {
    const batchedQueries = createBatchedQueries(options!.query!);
    return batchGetList<T>(options!.query!, batchedQueries, async (chunk) => {
      const path = this.getPathPrefix(options);
      const queryBuilder = this.getQueryBuilder(chunk);
      return this.firebaseService.getDocumentList<T>(path, queryBuilder);
    });
  }

  @withErrorHandling({
    errorMessage: (ctx) => `Error persisting in ${ctx.constructor.name}`,
  })
  public async create(
    entity: Omit<T, keyof BaseModel>,
    options?: Options & BaseServiceOptions,
    id?: string
  ): Promise<void> {
    const path = this.getPath(options);
    const dto = this.toPersistenceModel(entity);
    await this.firebaseService.addDocument(path, dto, undefined, {
      id,
    });
  }

  @withErrorHandling({
    errorMessage: (ctx) => `Error persisting list in ${ctx.constructor.name}`,
  })
  public async createList(
    entities: Omit<T, keyof BaseModel>[],
    options?: Options & BaseServiceOptions
  ): Promise<void> {
    const path = this.getPath(options);
    const dtos = entities.map(this.toPersistenceModel);
    await this.firebaseService.addDocumentList(
      path,
      dtos as unknown as { [key: string]: any }[]
    );
  }

  @withErrorHandling({
    errorMessage: (ctx) => `Error updating in ${ctx.constructor.name}`,
  })
  public async update(
    id: string,
    data: Omit<Partial<T>, keyof BaseModel>,
    options?: Options & BaseServiceOptions
  ): Promise<void> {
    const path = this.getPath(options);
    const dto = this.toPersistenceModel(data);
    return await this.firebaseService.updateDocument<DTO>(path, id, dto);
  }

  @withErrorHandling({
    errorMessage: (ctx) => `Error deleting in ${ctx.constructor.name}`,
  })
  public async delete(
    id: string,
    options?: Options & BaseServiceOptions
  ): Promise<void> {
    const path = this.getPath(options);
    return await this.firebaseService.deleteDocument(path, id);
  }

  public subscribeSingle(
    callback: (entity: T) => void,
    onError: (error: Error) => void,
    id: string,
    options?: Options & BaseServiceOptions
  ): Unsubscribe {
    const path = this.getPath(options);
    return this.firebaseService.subscribeToDocument<T>(
      path,
      id,
      (data) => {
        return callback(this.mapper(data || {}));
      },
      (error) => {
        console.error(
          `${error} in single subscription in ${this.constructor.name}`
        );
        onError(error);
      }
    );
  }

  public subscribe(
    onData: (entities: T[]) => void,
    onError?: (error: Error) => void,
    options?: Options & BaseServiceOptions
  ) {
    const queryOptions = options?.soleQuery
      ? options.soleQuery
      : QueryBuilderFactory.deepMergeQueryOptions(
          this.getDefaultListQueryOptions(),
          options?.query
        );

    const mergedOptions = {
      ...options,
      query: queryOptions,
    } as Options & BaseServiceOptions;

    if (isBatchingRequired(queryOptions)) {
      return this.getBatchedSubscribe(onData, onError, mergedOptions);
    }
    const path = this.getPath(mergedOptions);
    const queryBuilder = this.getQueryBuilder(queryOptions);
    return this.firebaseService.subscribeToCollection<T>(
      path,
      (data) => {
        onData(data?.map(this.mapper) || []);
      },
      (error) => {
        console.error(`${error} in subscription ${this.constructor.name}`);
        onError?.(error);
      },
      undefined,
      queryBuilder
    );
  }

  private getBatchedSubscribe(
    onData: (entities: T[]) => void,
    onError?: (error: Error) => void,
    options?: Options & BaseServiceOptions
  ): Unsubscribe {
    const queryOptions = options?.soleQuery
      ? options.soleQuery
      : QueryBuilderFactory.deepMergeQueryOptions(
          this.getDefaultListQueryOptions(),
          options?.query
        );

    const batchedQueries = createBatchedQueries(queryOptions);
    const unsubscribers: Unsubscribe[] = batchedQueries.map((chunk) => {
      const path = this.getPathPrefix(options);
      const qb = this.getQueryBuilder(chunk);
      return this.firebaseService.subscribeToCollection<T>(
        path,
        (data) => {
          const mapped = data?.map(this.mapper) || [];
          onData(mapped);
        },
        (error) => {
          console.error(`${error} in batching ${this.constructor.name}`);
          onError?.(error);
        },
        undefined,
        qb
      );
    });

    return () => unsubscribers.forEach((unsub) => unsub());
  }

  protected getQueryBuilder(options?: QueryOptions): QueryBuilder {
    return options
      ? QueryBuilderFactory.fromOptions(options)
      : QueryBuilderFactory.default();
  }
}
