import { type FeedbackType } from './FeedbackType';
import { type TrialExpiredFeedback } from './TrialExpiredFeedback';
import { type UserLimitFeedback } from './UserLimitFeedback';

export type FeedbackPayload = TrialExpiredFeedback | UserLimitFeedback;

export class SendFeedbackDto {
  type: FeedbackType;
  payload: FeedbackPayload;

  constructor({ type, payload }: SendFeedbackDto) {
    this.type = type;
    this.payload = payload;
  }
}
