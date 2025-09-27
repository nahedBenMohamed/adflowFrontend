export interface FrontendObjectDto<T extends unknown = unknown> {
  key: string;
  value: T;
  createdAt: string;
}
