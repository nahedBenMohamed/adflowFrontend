import { type FeatureCode } from '../../../../shared/lib/models/Feature/FeatureCode';

export class FeatureDto {
  id: number;
  name: string;
  code: FeatureCode;
  isEnabled: boolean;

  constructor({ id, name, code, isEnabled }: FeatureDto) {
    this.id = id;
    this.name = name;
    this.code = code;
    this.isEnabled = isEnabled;
  }
}
