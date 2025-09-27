import {
  ProjectFieldsSettingsComponent,
  type FieldCode,
  type ProjectFieldsSettings,
} from '@/modules/fields';
import { DeleteButton, MyDropdown, TruncateMixin } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { RefObject, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { ThreeDotsVerticalIcon, TuneIcon } from '../../../assets';

const IconWrapper = styled.div<{ $active: boolean }>`
  width: 16px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  margin-left: auto;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-active);
      }
    `}
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;

  padding: 6px 0;
`;

const Action = styled.li<{ $active?: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 6px 16px;

  &:hover {
    cursor: pointer;

    background-color: #f3fded;
  }

  ${p => p.$active && `background-color: #e6fbda`};

  ${TruncateMixin}
`;

const TuneIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProjectFieldsSettingsWrapper = styled.div`
  padding: 10px;
`;

interface Props {
  canDelete: boolean;
  canTune: boolean;
  activeProjectFieldCodes?: FieldCode[];
  onDelete: () => void;
  onFieldsSettingsChange: (fieldsSettings: ProjectFieldsSettings) => void;
}

const ActionsDropdown = observer((props: Props) => {
  const { canDelete, canTune, activeProjectFieldCodes, onFieldsSettingsChange, onDelete } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.actions_dropdown',
  });

  const dotsRef = useRef<HTMLDivElement>(null);

  const [opened, { close, open }] = useDisclosure(false);
  const [tuneDropdownOpened, { close: hideTuneDropdown, open: showTuneDropdown }] =
    useDisclosure(false);

  const handleDelete = useCallback(() => {
    onDelete();
    close();
  }, [close, onDelete]);

  const handleHide = useCallback(() => {
    // to close dropdowns in correct order with minimal delay
    if (tuneDropdownOpened) {
      hideTuneDropdown();

      setTimeout(() => {
        close();
      }, 200);

      return;
    }

    close();
  }, [tuneDropdownOpened, close, hideTuneDropdown]);

  useOnClickOutside(dotsRef as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    if (target.closest('.workspace__MyDropdown--StyledDropdown')) return;

    handleHide();
  });

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-start"
      closeOnClickOutside={false}
      Button={
        <IconWrapper ref={dotsRef} $active={opened}>
          <ThreeDotsVerticalIcon />
        </IconWrapper>
      }
      show={open}
      hide={handleHide}
    >
      <List>
        {canTune && activeProjectFieldCodes && (
          <MyDropdown
            withinPortal
            position="right-start"
            opened={tuneDropdownOpened}
            closeOnClickOutside={false}
            Button={
              <Action $active={tuneDropdownOpened}>
                <TuneIconWrapper>
                  <TuneIcon />
                </TuneIconWrapper>

                {t('fine_tune')}
              </Action>
            }
            hide={hideTuneDropdown}
            show={showTuneDropdown}
          >
            <ProjectFieldsSettingsWrapper>
              <ProjectFieldsSettingsComponent
                activeProjectFieldCodes={activeProjectFieldCodes}
                onChange={onFieldsSettingsChange}
              />
            </ProjectFieldsSettingsWrapper>
          </MyDropdown>
        )}

        {canDelete && (
          <Action onClick={handleDelete}>
            <DeleteButton text={t('delete_entity')} fontWeight={400} />
          </Action>
        )}
      </List>
    </MyDropdown>
  );
});

ActionsDropdown.displayName = 'ActionsDropdown';
export { ActionsDropdown };
