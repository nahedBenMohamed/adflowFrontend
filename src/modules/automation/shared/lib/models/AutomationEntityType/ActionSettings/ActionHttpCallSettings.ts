import type { HttpMethod, Nullable } from '@/shared';
import type { ActionCommonSettings } from './ActionCommonSettings';

export interface ActionHttpCallSettings extends ActionCommonSettings {
  url: string;
  method: HttpMethod;
  headers?: Nullable<Record<string, string>>;
  params?: Nullable<Record<string, string>>;
}
