import {
  AllChatsGreyIcon,
  AllChatsIcon,
  AvitoGreyIcon,
  AvitoIcon,
  FacebookGreyIcon,
  FacebookIcon,
  InstagramGreyIcon,
  InstagramIcon,
  LogoFlowerRoundGreyIcon,
  LogoFlowerRoundIcon,
  TelegramGreyIcon,
  TelegramIcon,
  VkGreyIcon,
  VkIcon,
  WhatsappGreyIcon,
  WhatsappIcon,
  type Nullable,
} from '@/shared';
import { memo, type ReactNode } from 'react';
import styled from 'styled-components';
import { ChatProviderTransport } from '../../../../../models';

const Root = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

interface Props {
  active: boolean;
  transport: ChatProviderTransport | 'all';
}

const ProviderIcon = memo((props: Props): Nullable<ReactNode> => {
  const { active, transport } = props;

  let Icon: ReactNode;

  switch (transport) {
    case 'all': {
      Icon = active ? <AllChatsIcon /> : <AllChatsGreyIcon />;

      break;
    }

    case ChatProviderTransport.AMWORK: {
      Icon = active ? <LogoFlowerRoundIcon /> : <LogoFlowerRoundGreyIcon />;

      break;
    }

    case ChatProviderTransport.MESSENGER: {
      Icon = active ? <FacebookIcon /> : <FacebookGreyIcon />;

      break;
    }

    case ChatProviderTransport.WHATSAPP: {
      Icon = active ? <WhatsappIcon /> : <WhatsappGreyIcon />;

      break;
    }

    case ChatProviderTransport.TELEGRAM: {
      Icon = active ? <TelegramIcon /> : <TelegramGreyIcon />;

      break;
    }

    case ChatProviderTransport.AVITO: {
      Icon = active ? <AvitoIcon /> : <AvitoGreyIcon />;

      break;
    }

    case ChatProviderTransport.INSTAGRAM: {
      Icon = active ? <InstagramIcon /> : <InstagramGreyIcon />;

      break;
    }

    case ChatProviderTransport.VK: {
      Icon = active ? <VkIcon /> : <VkGreyIcon />;

      break;
    }

    default: {
      Icon = active ? <LogoFlowerRoundIcon /> : <LogoFlowerRoundGreyIcon />;

      break;
    }
  }

  return Icon ? <Root>{Icon}</Root> : null;
});

ProviderIcon.displayName = 'ProviderIcon';
export { ProviderIcon };
