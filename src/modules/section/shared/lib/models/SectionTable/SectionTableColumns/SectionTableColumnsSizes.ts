import type { MinMaxColumnSize } from '../../../types';
import { SectionTableColumnsIds } from './SectionTableColumnsIds';

type ExcludedSectionTableColumnsIds = Exclude<
  SectionTableColumnsIds,
  SectionTableColumnsIds.OWNER | SectionTableColumnsIds.STAGE
>;

export const SectionTableColumnsSizes: Record<
  ExcludedSectionTableColumnsIds | MinMaxColumnSize,
  number
> = {
  [SectionTableColumnsIds.NAME]: 176,
  [SectionTableColumnsIds.CHECKBOX]: 18,
  min: 68,
  max: 640,
} as const;
