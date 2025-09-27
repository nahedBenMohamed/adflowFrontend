import styled, { css } from 'styled-components';
import { FieldLinkWrapper } from '../../../../../../../components';

interface Props {
  $loading?: boolean;
  $secondaryActive?: boolean;
}

export const WhatsAppLinkWrapper = styled(FieldLinkWrapper)<Props>`
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-primary-text);
  }

  &&:hover {
    border-color: #1bd741;
    background-color: #1bd741;

    svg path {
      fill: var(--primary-statuses-white-0);
    }
  }

  &&:active {
    border-color: #17b537;
    background-color: #17b537;

    svg path {
      fill: var(--primary-statuses-white-0);
    }
  }

  ${p => p.$loading && `opacity: 0.8`};

  ${p =>
    p.$primaryActive &&
    css`
      && {
        border-color: #17b537;
        background-color: #17b537;

        svg path {
          fill: var(--primary-statuses-white-0);
        }
      }
    `};
`;
