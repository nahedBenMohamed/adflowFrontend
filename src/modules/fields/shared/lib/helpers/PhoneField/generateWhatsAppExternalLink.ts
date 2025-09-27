import type { GenerateExternalChatLinkHandler } from '../../types';
import { sanitizeAndModifyPhoneNumber } from './sanitizeAndModifyPhoneNumber';

export const generateWhatsAppExternalLink: GenerateExternalChatLinkHandler = ({
  phoneNumber,
  isRULocale,
}) => `https://wa.me/${sanitizeAndModifyPhoneNumber({ phoneNumber, isRULocale })}`;
