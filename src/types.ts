export type Prettify<Type> = Type extends () => unknown
  ? Type
  : Extract<
      {
        [Key in keyof Type]: Type[Key];
      },
      Type
    >;

export type Merge<Object1, Object2> = Prettify<
  Omit<Object1, keyof Object2> & Object2
>;

export type GenerateQueryKey<T extends string> = (
  ...args: unknown[]
) => [T, ...unknown[]];

export type GenerateQueryKeyWithArgs<T extends string, U extends unknown[]> = (
  ...args: U[]
) => [T, ...U[]];

export type GenerateQueryKeyFunction<
  T extends string,
  U extends unknown[] = unknown[],
> = GenerateQueryKey<T> | GenerateQueryKeyWithArgs<T, U>;
