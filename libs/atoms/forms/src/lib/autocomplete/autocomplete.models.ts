export type CreateOptionFn<T> = (input: string) => T;

export type DisplayFn<T> = (option: T) => string;

export type IdentityFn<T> = (option: T) => unknown;

export type OpenOn = 'focus' | 'input';
