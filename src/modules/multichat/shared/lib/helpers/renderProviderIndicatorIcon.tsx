import { AvitoIcon, InstagramIcon, LogoFlowerRoundIcon, TelegramIcon, VkIcon } from '@/shared';
import type { ReactNode, SVGAttributes } from 'react';
import styled from 'styled-components';
import { FacebookMessengerProviderIcon, WhatsAppProviderIcon } from '../../assets';
import { ChatProviderTransport } from '../models';

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: 50%;
  background-color: var(--primary-statuses-white-0);

  svg {
    width: 18px;
    height: 18px;
  }
`;

const size = {
  width: 18,
  height: 18,
} satisfies SVGAttributes<SVGElement>;

export const renderProviderIndicatorIcon = (
  providerTransport: ChatProviderTransport
): ReactNode => {
  let Icon: ReactNode;

  switch (providerTransport) {
    case ChatProviderTransport.AMWORK: {
      Icon = <LogoFlowerRoundIcon {...size} />;

      break;
    }

    case ChatProviderTransport.WHATSAPP: {
      Icon = <WhatsAppProviderIcon {...size} />;

      break;
    }

    case ChatProviderTransport.MESSENGER: {
      Icon = <FacebookMessengerProviderIcon {...size} />;

      break;
    }

    case ChatProviderTransport.TELEGRAM: {
      Icon = <TelegramIcon {...size} />;

      break;
    }

    case ChatProviderTransport.VK: {
      Icon = <VkIcon {...size} />;

      break;
    }

    case ChatProviderTransport.AVITO: {
      Icon = <AvitoIcon {...size} />;

      break;
    }

    case ChatProviderTransport.INSTAGRAM: {
      Icon = <InstagramIcon {...size} />;

      break;
    }

    default:
      Icon = <LogoFlowerRoundIcon {...size} />;
  }

  return <IconWrapper>{Icon}</IconWrapper>;
};
