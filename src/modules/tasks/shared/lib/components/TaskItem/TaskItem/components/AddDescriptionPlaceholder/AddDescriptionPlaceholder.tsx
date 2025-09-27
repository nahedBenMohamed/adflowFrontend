import { AddSquareIcon } from '@/shared';
import { memo, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const AddTemplateLink = styled.button<{ $canEdit: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg rect {
    transition: var(--transition-200);
  }

  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-hover);

    svg rect {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    color: var(--button-text-green-active);

    svg rect {
      fill: var(--button-text-green-active);
    }
  }

  ${p => !p.$canEdit && `pointer-events: none`};
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  canEdit: boolean;
}

const AddDescriptionPlaceholder = memo((props: Props) => {
  const { canEdit, ...rest } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  return (
    <AddTemplateLink type="button" {...rest} $canEdit={canEdit}>
      {canEdit && <AddSquareIcon />}

      {canEdit ? t('add_description') : t('no_description')}
    </AddTemplateLink>
  );
});

AddDescriptionPlaceholder.displayName = 'AddDescriptionPlaceholder';
export { AddDescriptionPlaceholder };
