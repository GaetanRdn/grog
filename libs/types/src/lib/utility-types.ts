export type BooleanInput = string | boolean | null | undefined;

export type Nullable<Type> = Type | null;

type MarkFunctionProperties<Component> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof Component]: Component[Key] extends Function ? never : Key;
};

type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;

export type NgChanges<Component, Props = ExcludeFunctions<Component>> = {
  [Key in keyof Props]: {
    previousValue: Props[Key];
    currentValue: Props[Key];
    firstChange: boolean;
    isFirstChange(): boolean;
  };
};

export type EqualsFn<Type> = (
  obj1: Nullable<Type>,
  obj2: Nullable<Type>
) => boolean;
