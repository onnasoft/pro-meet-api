type NonObjectKeys<T> = {
  [K in keyof T]-?: T[K] extends object
    ? T[K] extends Date | null // permite Date y null
      ? K
      : never
    : K;
}[keyof T];

type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>;

export type Create<T> = Omit<
  Pick<T, Extract<NonObjectKeys<T>, RequiredKeys<T>>> &
    Partial<Pick<T, Extract<NonObjectKeys<T>, OptionalKeys<T>>>>,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type Update<T> = Partial<Create<T>>;
