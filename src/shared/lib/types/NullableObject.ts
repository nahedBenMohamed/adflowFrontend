export type NullableObject<T> = { [Key in keyof T]: T[Key] | null };
