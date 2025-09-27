import type { GanttView } from '../types';
import type { GanttViewValues } from './GanttViewValues';

export interface GanttViewConfig {
  view: GanttView;
  value: GanttViewValues;
}
