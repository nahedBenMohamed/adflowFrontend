import type { ReportsSection } from './ReportsSection';

export interface RenderTabs<T> {
  value: ReportsSection | string;
  reportType: T;
}
