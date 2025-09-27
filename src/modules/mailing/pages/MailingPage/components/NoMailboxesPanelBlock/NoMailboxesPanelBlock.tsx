import { routes } from '@/app';
import { BigPlusIcon } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  margin: 24px auto 0;
`;

const NoMailboxesAnnotation = styled.div`
  max-width: 202px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);
`;

const AddMailboxButton = styled(Link)`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    border: 1px solid var(--button-text-green-hover);

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    border: 1px solid var(--button-text-green-active);

    svg path {
      fill: var(--button-text-green-active);
    }
  }
`;

const NoMailboxesPanelBlock = memo(() => {
  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.no_mailboxes_panel_block',
  });

  return (
    <Root>
      <NoMailboxesAnnotation>{t('title')}</NoMailboxesAnnotation>

      <AddMailboxButton to={routes.settingsMailingAddMailbox()}>
        <BigPlusIcon />
      </AddMailboxButton>
    </Root>
  );
});

NoMailboxesPanelBlock.displayName = 'NoMailboxesPanelBlock';
export { NoMailboxesPanelBlock };
