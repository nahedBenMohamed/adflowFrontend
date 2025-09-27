import styled from 'styled-components';
import { WhatsAppLinkWrapper } from '../WhatsAppLinkWrapper/WhatsAppLinkWrapper';

export const TelegramLinkWrapper = styled(WhatsAppLinkWrapper)`
  &&:hover {
    border-color: #2aabee;
    background-color: #2aabee;
  }

  &&:active {
    border-color: #118ed0;
    background-color: #118ed0;
  }
`;
