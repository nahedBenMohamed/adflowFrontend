import type { GenerateExternalChatLinkHandler } from '../../types';
import { sanitizeAndModifyPhoneNumber } from './sanitizeAndModifyPhoneNumber';

export const generateTelegramExternalLink: GenerateExternalChatLinkHandler = ({
  phoneNumber,
  isRULocale,
}) => `https://t.me/${sanitizeAndModifyPhoneNumber({ phoneNumber, isRULocale })}`;
