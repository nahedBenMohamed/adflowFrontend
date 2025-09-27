import { MyInputWithLimitedLength } from '@/shared';
import { observer } from 'mobx-react-lite';
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import type { InputModel } from '../../../../models';
import { DeleteButton } from '../../../Buttons/DeleteButton/DeleteButton';

const StyledDeleteButton = styled(DeleteButton)`
  position: relative;

  cursor: pointer;

  display: inline-flex;

  margin: 0 3px 0 2px;

  &:before {
    content: '' !important;

    border: none;
    display: none;
  }
`;

interface RootProps {
  $active: boolean;
  $grayTitle: boolean;
  $padding: CSSProperties['padding'];
}

const Root = styled.div<RootProps>`
  position: relative;

  min-height: 26px;
  min-width: 20px;

  display: flex;
  align-items: center;

  z-index: 2;

  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  margin-right: 12px;
  padding: ${p => p.$padding};
  border-radius: var(--border-radius-element);

  svg path {
    transition: var(--transition-200);
  }

  &:before {
    display: none;
  }

  ${p =>
    !p.$active &&
    css`
      background: var(--graphite-graphite-20);
      border: 1px solid var(--graphite-graphite-120);
      transition: border var(--transition-200);

      &:hover {
        color: var(--button-text-graphite-priory-text);

        border-color: var(--button-text-graphite-secondary-text);

        ${StyledDeleteButton} svg path[stroke] {
          stroke: var(--button-text-graphite-primary-text);
        }
      }
    `}

  ${StyledDeleteButton} svg {
    &:hover path[stroke] {
      stroke: var(--button-text-red-hover);
    }

    &:active {
      path[stroke] {
        stroke: var(--primary-blue);
      }
    }
  }

  ${p =>
    p.$active &&
    css`
      border: 1px solid transparent;
      font-weight: 700;

      input {
        border-color: var(--button-text-graphite-secondary-text);
      }
    `}

  span {
    position: relative;

    ${p =>
      p.$grayTitle &&
      css`
        color: var(--button-text-graphite-secondary-text);
      `}

    &:hover {
      cursor: pointer;

      &:before {
        content: ' ';
        position: absolute;
        bottom: 2px;
        left: 0px;
        width: 100%;
      }
    }
  }

  * {
    &::before {
      display: none;
    }
  }
`;

const FIELD_GROUP_MAX_LENGTH = 50;

interface Props {
  title: InputModel;
  isActive: boolean;
  withDeleteButton: boolean;
  autoFocus?: boolean;
  onChange: (value: string) => void;
  onDelete: () => void;
}

const EditableTabTitle = observer((props: Props) => {
  const { autoFocus, isActive, title, withDeleteButton, onChange, onDelete } = props;

  const { t } = useTranslation();

  const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
    // to prevent click on tab
    e.stopPropagation();
    onDelete();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // to prevent antd from blocking spaces in TabPanes
    if (e.key === ' ') e.stopPropagation();
  };

  return (
    <Root
      $active={isActive}
      $grayTitle={!title.value.length}
      $padding={isActive ? 0 : withDeleteButton ? '0 0 0 8px' : '0 8px'}
    >
      {isActive && (
        <MyInputWithLimitedLength
          width="120px"
          model={title}
          variant="outlined"
          autoFocus={autoFocus}
          placeholder={t('title')}
          maxLength={FIELD_GROUP_MAX_LENGTH}
          hint={t('max_length', { length: FIELD_GROUP_MAX_LENGTH })}
          handleChange={onChange}
          onKeyDown={handleKeyDown}
        />
      )}

      {!isActive && <span>{title.value.length ? title.value : '...'}</span>}

      {/* this button should be rendered as div for valid HTML markup,
       because parent of this component (tab) is also button */}
      {withDeleteButton && <StyledDeleteButton asDiv onClick={handleDelete} />}
    </Root>
  );
});

EditableTabTitle.displayName = 'EditableTabTitle';
export { EditableTabTitle };
