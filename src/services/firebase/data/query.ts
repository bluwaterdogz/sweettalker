import {
  QueryConstraint,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
  endAt,
  endBefore,
  CollectionReference,
  Query,
  DocumentData,
  query,
  and,
  or,
  QueryFilterConstraint,
} from "firebase/firestore";

export type WhereOperator =
  | "=="
  | "!="
  | ">"
  | ">="
  | "<"
  | "<="
  | "array-contains"
  | "in"
  | "array-contains-any";

export type OrderDirection = "asc" | "desc";

export interface WhereClause {
  field: string;
  operator: WhereOperator;
  value: unknown;
}

export interface OrderByClause {
  field: string;
  direction?: OrderDirection;
}

export type LogicalOperator = "AND" | "OR";

export interface QueryGroup {
  operator: LogicalOperator;
  conditions: WhereClause[];
}

export type WhereCondition = WhereClause | QueryGroup;

export interface QueryOptions {
  where?: WhereCondition[];
  orderBy?: OrderByClause[];
  limit?: number;
  startAfter?: unknown;
  startAt?: unknown;
  endAt?: unknown;
  endBefore?: unknown;
}

export type QueryBuilder = (
  ref: CollectionReference<DocumentData>
) => Query<DocumentData>;

export class QueryBuilderFactory {
  private filterConstraints: QueryFilterConstraint[] = [];
  private otherConstraints: QueryConstraint[] = [];

  where(field: string, operator: WhereOperator, value: unknown): this {
    this.filterConstraints.push(where(field, operator, value));
    return this;
  }

  whereGroup(
    conditions: WhereClause[],
    operator: LogicalOperator = "AND"
  ): this {
    const whereConstraints = conditions.map(({ field, operator, value }) =>
      where(field, operator, value)
    );

    const compositeFilter =
      operator === "OR" ? or(...whereConstraints) : and(...whereConstraints);

    this.filterConstraints.push(compositeFilter as QueryFilterConstraint);
    return this;
  }

  orderBy(field: string, direction: OrderDirection = "asc"): this {
    this.otherConstraints.push(orderBy(field, direction));
    return this;
  }

  limitTo(limitCount: number): this {
    this.otherConstraints.push(limit(limitCount));
    return this;
  }

  startAfter(value: unknown): this {
    this.otherConstraints.push(startAfter(value));
    return this;
  }

  startAt(value: unknown): this {
    this.otherConstraints.push(startAt(value));
    return this;
  }

  endAt(value: unknown): this {
    this.otherConstraints.push(endAt(value));
    return this;
  }

  endBefore(value: unknown): this {
    this.otherConstraints.push(endBefore(value));
    return this;
  }

  build(): QueryBuilder {
    return (ref: CollectionReference<DocumentData>) => {
      const constraints: QueryConstraint[] = [];

      // Handle filter constraints
      if (this.filterConstraints.length > 0) {
        if (this.filterConstraints.length === 1) {
          constraints.push(
            this.filterConstraints[0] as unknown as QueryConstraint
          );
        } else {
          const compositeFilter = and(...this.filterConstraints);
          constraints.push(compositeFilter as unknown as QueryConstraint);
        }
      }

      // Add other constraints
      constraints.push(...this.otherConstraints);

      return query(ref, ...constraints);
    };
  }

  static fromOptions(options: QueryOptions): QueryBuilder {
    const builder = new QueryBuilderFactory();

    if (options.where) {
      options.where.forEach((condition) => {
        if ("operator" in condition && "conditions" in condition) {
          // It's a QueryGroup
          const group = condition as QueryGroup;
          builder.whereGroup(group.conditions, group.operator);
        } else if (
          "field" in condition &&
          "operator" in condition &&
          "value" in condition
        ) {
          // It's a WhereClause
          const clause = condition as WhereClause;
          builder.where(clause.field, clause.operator, clause.value);
        }
      });
    }

    options.orderBy?.forEach(({ field, direction }) => {
      builder.orderBy(field, direction);
    });

    if (options.limit) builder.limitTo(options.limit);
    if (options.startAfter) builder.startAfter(options.startAfter);
    if (options.startAt) builder.startAt(options.startAt);
    if (options.endAt) builder.endAt(options.endAt);
    if (options.endBefore) builder.endBefore(options.endBefore);

    return builder.build();
  }

  static default(): QueryBuilder {
    return (ref: CollectionReference<DocumentData>) => query(ref);
  }

  static deepMergeQueryOptions(
    base: QueryOptions = {},
    override: QueryOptions = {}
  ): QueryOptions {
    const merged: QueryOptions = {
      where: [...(base.where || []), ...(override.where || [])],
      orderBy: [...(base.orderBy || []), ...(override.orderBy || [])],
      limit: override.limit ?? base.limit,
      startAfter: override.startAfter ?? base.startAfter,
      startAt: override.startAt ?? base.startAt,
      endAt: override.endAt ?? base.endAt,
      endBefore: override.endBefore ?? base.endBefore,
    };

    // Remove undefined fields
    Object.keys(merged).forEach((key) => {
      if (merged[key as keyof QueryOptions] === undefined) {
        delete merged[key as keyof QueryOptions];
      }
    });

    return merged;
  }
}
