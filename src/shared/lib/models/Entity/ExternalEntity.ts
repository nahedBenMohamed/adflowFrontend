import type { Nullable } from '../../types';
import type { ExternalSystemCode } from './ExternalSystemCode';

interface ExternalSystemDto {
  id: number;
  name: string;
  code: ExternalSystemCode;
}

interface UIDataRecord {
  key: string;
  label: string;
  value: any;
  sortOrder: number;
}

export interface ExternalEntity {
  id: number;
  url: string;
  entityId: number;
  system: Nullable<ExternalSystemDto>;
  uiData: Nullable<UIDataRecord[]>;
}
