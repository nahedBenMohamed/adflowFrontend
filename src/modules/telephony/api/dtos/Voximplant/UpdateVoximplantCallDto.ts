import type { Nullable } from '@/shared';
import type { CallDirection, CallStatus } from '../../../shared';

export class UpdateVoximplantCallDto {
  entityId: Nullable<number>;
  direction: CallDirection;
  phoneNumber: string;
  // in seconds
  duration: Nullable<number>;
  status: Nullable<CallStatus>;
  failureReason: Nullable<string>;
  recordUrl: Nullable<string>;
  comment: string;

  private constructor(data: Partial<UpdateVoximplantCallDto>) {
    Object.assign(this, data);
  }

  static create(data: Partial<UpdateVoximplantCallDto>): UpdateVoximplantCallDto {
    return new UpdateVoximplantCallDto(data);
  }
}
