type ExcludedKeys = 'id' | 'createdAt' | 'updatedAt' | 'deletedAt';

type IsColumnValue<T> = T extends Date | null
  ? true
  : T extends object
    ? false
    : true;

type ColumnKeys<T> = {
  [K in keyof T]-?: IsColumnValue<T[K]> extends true ? K : never;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;

export type Create<T> = Omit<
  Pick<T, Extract<ColumnKeys<T>, RequiredKeys<T>>> &
    Partial<Pick<T, Extract<ColumnKeys<T>, OptionalKeys<T>>>>,
  ExcludedKeys
>;

export type Update<T> = Partial<Create<T>>;
