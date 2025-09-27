import { MailingApiRoutes } from '@/modules/mailing';
import { baseApi } from '../BaseApi/BaseApi';
import { SendFeedbackDto, type FeedbackPayload, type FeedbackType } from '../dtos';

class FeedbackApi {
  sendFeedback = async ({
    type,
    payload,
  }: {
    type: FeedbackType;
    payload: FeedbackPayload;
  }): Promise<void> => {
    await baseApi.post(MailingApiRoutes.SEND_FEEDBACK, new SendFeedbackDto({ type, payload }));
  };
}

export const feedbackApi = new FeedbackApi();
