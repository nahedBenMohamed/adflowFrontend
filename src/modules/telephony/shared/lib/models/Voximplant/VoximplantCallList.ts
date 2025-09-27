import type { PagingMeta } from '@/shared';
import type { VoximplantCallListDto } from '../../../../api';
import { VoximplantCall } from './VoximplantCall';

export class VoximplantCallList {
  calls: VoximplantCall[];
  meta: PagingMeta;

  constructor(calls: VoximplantCall[], meta: PagingMeta) {
    this.calls = calls;
    this.meta = meta;
  }

  static fromDto(dto: VoximplantCallListDto): VoximplantCallList {
    return new VoximplantCallList(VoximplantCall.fromDtos(dto.calls), dto.meta);
  }
}
