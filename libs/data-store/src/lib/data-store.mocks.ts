export interface Person {
  readonly id?: number | undefined;
  firstName: string;
  lastName: string;
  age?: number | null | undefined;
}
