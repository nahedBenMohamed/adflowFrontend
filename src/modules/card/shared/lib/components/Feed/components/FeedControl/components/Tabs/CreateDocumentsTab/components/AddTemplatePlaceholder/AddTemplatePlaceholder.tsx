import { routes } from '@/app';
import { AddSquareIcon, NoOptionsMessage } from '@/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AddTemplateLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  font-weight: 400px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg rect {
    transition: var(--transition-200);
  }

  &:hover {
    color: var(--button-text-blue-hover);

    svg rect {
      fill: var(--button-text-blue-hover);
    }
  }
`;

const AddTemplatePlaceholder = () => {
  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.create_documents',
  });

  return (
    <NoOptionsMessage>
      <AddTemplateLink to={routes.settingsDocumentTemplates()}>
        <AddSquareIcon />

        {t('add_template')}
      </AddTemplateLink>
    </NoOptionsMessage>
  );
};

export { AddTemplatePlaceholder };
