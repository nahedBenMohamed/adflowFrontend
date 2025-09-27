import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CancelButton = styled.button`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);

  padding: 4px 8px;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-priory-text);

    background-color: #f3fded;
  }

  &:active {
    color: var(--button-text-graphite-primary-text);

    background-color: #e6fbda;
  }
`;

const SaveButton = styled.button<{ $loading?: boolean }>`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-green-default);

  padding: 4px 8px;
  background-color: #f3fded;
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-green-active);

    background-color: #e6fbda;
  }

  &:active {
    color: var(--button-text-green-hover);
  }

  ${p =>
    p.$loading &&
    css`
      pointer-events: none;

      opacity: 0.5;
    `}
`;

interface Props {
  visibleSaveButton: boolean;
  saving?: boolean;
  handleSave: () => void;
  handleCancel?: () => void;
}

const TextEditorControls = (props: Props) => {
  const { visibleSaveButton, saving, handleCancel, handleSave } = props;

  const { t } = useTranslation();

  const onCancelButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    handleCancel?.();
  };

  const onSaveButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    handleSave();
  };

  return (
    <Root>
      {handleCancel && (
        <CancelButton type="button" onClick={onCancelButtonClick}>
          {t('buttons.cancel')}
        </CancelButton>
      )}

      {visibleSaveButton && (
        <SaveButton type="button" $loading={saving} onClick={onSaveButtonClick}>
          {t('buttons.save')}
        </SaveButton>
      )}
    </Root>
  );
};

export { TextEditorControls };
