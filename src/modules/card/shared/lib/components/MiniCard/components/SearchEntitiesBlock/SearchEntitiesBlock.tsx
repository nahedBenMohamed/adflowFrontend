import { entityTypeStore, iconStore } from '@/app';
import {
  MyDropdownItemRoot,
  MyDropdownListRoot,
  MyDropdownTitleWrapper,
  MyInput,
  MyPopover,
  TextHighlighter,
  debounce,
  useDropdownWidth,
  type EntityInfo,
  type InputModel,
  type MyInputVariant,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  position: relative;

  width: 100%;
  min-width: 200px;
`;

const IconWrapper = styled.div<{ $iconColor: string }>`
  width: 18px;

  display: flex;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: auto;
  }

  svg rect,
  svg circle,
  svg ellipse,
  svg path {
    fill: ${p => p.$iconColor};
  }
`;

interface Props {
  title: InputModel;
  placeholder: string;
  inputVariant: MyInputVariant;
  inModal?: boolean;
  showIcons?: boolean;
  withinPortal?: boolean;
  alreadySelectedEntities?: number[];
  hideOnBlur?: boolean;
  onSelectEntity?: (selectedEntityId: number) => Promise<void>;
  handleSearchEntities: (title: string) => Promise<EntityInfo[]>;
  onSelectEntityFull?: (selectedEntity: EntityInfo) => void;
}

const SearchEntitiesBlock = observer((props: Props) => {
  const {
    title,
    placeholder,
    inputVariant,
    withinPortal,
    inModal,
    showIcons,
    alreadySelectedEntities,
    onSelectEntity,
    onSelectEntityFull,
    handleSearchEntities,
  } = props;

  const [isSelectingEntity, setIsSelectingEntity] = useState(false);

  const [dropdownWidth, titleInputRef] = useDropdownWidth<HTMLInputElement>();

  const [isPopoverOpened, { close: hidePopover, open: showPopover }] = useDisclosure(false);

  const [entities, setEntities] = useState<EntityInfo[]>([]);
  const [searching, setSearching] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchEntitiesByName = useCallback(
    debounce(async (): Promise<void> => {
      try {
        setSearching(true);

        let entities = await handleSearchEntities(title.value);

        if (alreadySelectedEntities)
          entities = entities.filter(e => !alreadySelectedEntities.includes(e.id));

        setEntities(entities);

        if (entities.length) showPopover();
      } finally {
        setSearching(false);
      }
    }, 350),
    []
  );

  const handleChange = useCallback(
    (value: string) => {
      if (value.trim().length > 2) {
        debouncedSearchEntitiesByName();
      } else {
        hidePopover();
      }
    },
    [debouncedSearchEntitiesByName, hidePopover]
  );

  const handleFocus = useCallback(() => {
    if (title.trimmedValue.length > 2 && entities.length > 0) showPopover();
  }, [showPopover, entities, title.trimmedValue]);

  const handleSelectEntity = useCallback(
    async (entityId: number): Promise<void> => {
      const entity = entities.find(e => e.id === entityId);

      if (entity) {
        await onSelectEntity?.(entity.id);
        onSelectEntityFull?.(entity);

        hidePopover();
      }
    },
    [entities, onSelectEntity, onSelectEntityFull, hidePopover]
  );

  const getSelectEntityHandler = useCallback(
    (selectedEntityId: number) => async (): Promise<void> => {
      try {
        setIsSelectingEntity(true);

        await handleSelectEntity(selectedEntityId);
      } catch (e) {
        throw new Error(`Failed to select entity ${selectedEntityId} in SearchEntitiesBlock, ${e}`);
      } finally {
        setIsSelectingEntity(false);
      }
    },
    [handleSelectEntity]
  );

  const TitleInput = useMemo<ReactNode>(
    () => (
      <MyInput
        ref={titleInputRef}
        autoFocus
        alwaysActive
        model={title}
        variant={inputVariant}
        placeholder={placeholder}
        loading={searching || isSelectingEntity}
        onFocus={handleFocus}
        handleChange={handleChange}
      />
    ),
    [
      title,
      searching,
      placeholder,
      inputVariant,
      titleInputRef,
      isSelectingEntity,
      handleFocus,
      handleChange,
    ]
  );

  return (
    <Root>
      <MyPopover
        inModal={inModal}
        Target={TitleInput}
        opened={isPopoverOpened}
        withinPortal={withinPortal}
        hide={hidePopover}
      >
        {entities.length > 0 && (
          <MyDropdownListRoot $maxHeight="256px" $width={dropdownWidth}>
            {entities.map(e => {
              const entityType = entityTypeStore.getById(e.entityTypeId);

              const { icon } = iconStore.getByName(entityType.section.icon);
              const iconColor = iconStore.getEntityColorByEntityCategory(entityType.entityCategory);

              return (
                <MyDropdownItemRoot
                  key={e.id}
                  onClick={isSelectingEntity ? undefined : getSelectEntityHandler(e.id)}
                >
                  <MyDropdownTitleWrapper>
                    {title ? (
                      <TextHighlighter truncate filter={title.value} str={e.name} />
                    ) : (
                      e.name
                    )}
                  </MyDropdownTitleWrapper>

                  {showIcons && <IconWrapper $iconColor={iconColor}>{icon}</IconWrapper>}
                </MyDropdownItemRoot>
              );
            })}
          </MyDropdownListRoot>
        )}
      </MyPopover>
    </Root>
  );
});

SearchEntitiesBlock.displayName = 'SearchEntitiesBlock';
export { SearchEntitiesBlock };
