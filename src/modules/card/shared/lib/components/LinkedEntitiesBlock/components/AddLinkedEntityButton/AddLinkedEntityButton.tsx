import { iconStore } from '@/app';
import { DragFieldIcon, MiniLoader, TruncateMixin, type EntityType } from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Text = styled.div`
  position: relative;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);

  ${TruncateMixin}
`;

interface RootProps {
  $moduleColor: string;
  $hoverable: boolean;
  $loading?: boolean;
  $outlined?: boolean;
}

const Root = styled.button<RootProps>`
  width: 100%;

  display: flex;
  align-items: center;

  padding: 10px 16px;
  background: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  box-shadow:
    0 1px 2px #d0daeb,
    0 0 2px #eef4fe;
  transition: var(--transition-200);

  svg {
    rect,
    circle,
    ellipse,
    path {
      fill: var(--graphite-graphite-200);
      transition: var(--transition-200);
    }
  }

  ${p =>
    p.$hoverable &&
    css`
      &:hover {
        cursor: pointer;

        svg {
          rect,
          circle,
          ellipse,
          path {
            fill: ${p.$moduleColor};
          }
        }

        ${Text} {
          color: var(--button-text-graphite-priory-text);
        }
      }

      &:active {
        ${Text} {
          color: var(--button-text-graphite-primary-text);
        }
      }
    `}

  ${p =>
    p.$outlined &&
    css`
      box-shadow: none;
      border: 1px solid var(--graphite-graphite-80);
    `}

    ${p =>
    p.$loading &&
    css`
      cursor: wait;

      opacity: 0.8;
    `}
`;

const DragIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    fill: var(--button-text-graphite-primary-text);
  }
`;

const ModuleIconWrapper = styled.div`
  width: 36px;
  height: 36px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    rect:not(:first-child),
    circle,
    ellipse,
    path {
      fill: activeColor;
    }
  }
`;

interface Props {
  et: EntityType;
  addingLinkedEntity?: boolean;
  outlined?: boolean;
  editMode?: boolean;
  styles?: CSSProperties;
  dragHandleProps?: DraggableProvided['dragHandleProps'];
  handleAddEntity?: () => void;
}

const AddLinkedEntityButton = observer((props: Props) => {
  const { et, addingLinkedEntity, outlined, editMode, styles, dragHandleProps, handleAddEntity } =
    props;

  const { t } = useTranslation();

  const { icon } = iconStore.getByName(et.section.icon);
  const moduleColor = iconStore.getEntityColorByEntityCategory(et.entityCategory);

  return (
    <Root
      style={styles}
      $outlined={outlined}
      $hoverable={!editMode}
      $moduleColor={moduleColor}
      $loading={addingLinkedEntity}
      onClick={addingLinkedEntity ? undefined : handleAddEntity}
    >
      {editMode && dragHandleProps && (
        <DragIconWrapper {...dragHandleProps}>
          <DragFieldIcon />
        </DragIconWrapper>
      )}

      <ModuleIconWrapper>{icon}</ModuleIconWrapper>

      <Text>
        {t('buttons.add')} {et.name.toLowerCase()}{' '}
        {addingLinkedEntity && (
          <MiniLoader size="small" color="var(--button-text-graphite-secondary-text)" />
        )}
      </Text>
    </Root>
  );
});

AddLinkedEntityButton.displayName = 'AddLinkedEntityButton';
export { AddLinkedEntityButton };
