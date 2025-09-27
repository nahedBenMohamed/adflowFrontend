import { SearchEntitiesBlock } from '@/modules/card';
import { EntitySearchFilter } from '@/modules/section';
import { EntityApiUtil, InputModel, type EntityInfo, type Nullable } from '@/shared';
import { FocusTrap } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { RefObject, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { ChangeIcon } from '../../../../../../assets';

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 8px;
`;

const SearchEntityButton = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

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
        fill: var(--button-text-green-default);
      }
    `}
`;

const SearchBlockWrapper = styled.div<{ $visible: boolean }>`
  width: 100%;
  min-width: 220px;

  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: var(--transition-200);
`;

interface Props {
  selectedEntityId: Nullable<number>;
  onSelectEntity: (selectedEntityId: number) => Promise<void>;
}

const SelectEntityButton = observer((props: Props) => {
  const { selectedEntityId, onSelectEntity } = props;

  const { t } = useTranslation('common');

  const ref = useRef<HTMLDivElement>(null);

  const [opened, { toggle, close }] = useDisclosure(false);

  const title = useLocalObservable(() => InputModel.create());

  const onSearchEntities = async (title: string): Promise<EntityInfo[]> => {
    const dto = new EntitySearchFilter({ name: title });

    const result = await EntityApiUtil.searchEntities(dto);

    return result.entities;
  };

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const closeAndClear = useCallback(() => {
    close();

    timeoutRef.current = setTimeout(() => {
      // so that close animation can finish
      title.value = '';
    }, 250);
  }, [title, close]);

  useEffect(() => {
    return () => {
      close();

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [close]);

  const handleSelectEntity = useCallback(
    async (selectedEntityId: number): Promise<void> => {
      onSelectEntity(selectedEntityId);

      closeAndClear();
    },
    [onSelectEntity, closeAndClear]
  );

  useOnClickOutside(ref as RefObject<HTMLDivElement>, e => {
    const target = e.target as HTMLElement;

    if (
      target.closest('.workspace__MyDropdown--StyledDropdown') ||
      target.closest('.workspace__MyPopover--StyledDropdown')
    )
      return;

    closeAndClear();
  });

  return (
    <Root ref={ref}>
      <SearchEntityButton $active={opened} onClick={toggle}>
        <ChangeIcon />
      </SearchEntityButton>

      <FocusTrap active={opened}>
        <SearchBlockWrapper $visible={opened}>
          {opened && (
            <SearchEntitiesBlock
              inModal
              showIcons
              withinPortal
              title={title}
              hideOnBlur={false}
              inputVariant="primary"
              placeholder={t('update_task_modal.placeholders.search_card')}
              alreadySelectedEntities={selectedEntityId ? [selectedEntityId] : []}
              onSelectEntity={handleSelectEntity}
              handleSearchEntities={onSearchEntities}
            />
          )}
        </SearchBlockWrapper>
      </FocusTrap>
    </Root>
  );
});

SelectEntityButton.displayName = 'SelectEntityButton';
export { SelectEntityButton };
