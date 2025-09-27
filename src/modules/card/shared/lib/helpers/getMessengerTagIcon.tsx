import { ChatProviderTransport } from '@/modules/multichat';
import type { ReactNode } from 'react';
import {
  AvitoTagIcon,
  FbMessengerTagIcon,
  InstagramTagIcon,
  TelegramTagIcon,
  VkTagIcon,
  WhatsAppTagIcon,
} from '../../assets';

export const getMessengerTagIcon = (providerTransport: ChatProviderTransport): ReactNode => {
  switch (providerTransport) {
    case ChatProviderTransport.MESSENGER:
      return <FbMessengerTagIcon />;

    case ChatProviderTransport.WHATSAPP:
      return <WhatsAppTagIcon />;

    case ChatProviderTransport.TELEGRAM:
      return <TelegramTagIcon />;

    case ChatProviderTransport.INSTAGRAM:
      return <InstagramTagIcon />;

    case ChatProviderTransport.VK:
      return <VkTagIcon />;

    case ChatProviderTransport.AVITO:
      return <AvitoTagIcon />;

    default:
      return null;
  }
};
