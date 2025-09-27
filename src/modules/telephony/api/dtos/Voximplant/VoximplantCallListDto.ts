import type { PagingMeta } from '@/shared';
import type { VoximplantCallDto } from './VoximplantCallDto';

export interface VoximplantCallListDto {
  meta: PagingMeta;
  calls: VoximplantCallDto[];
}
