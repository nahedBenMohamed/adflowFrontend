import { iconStore, routes } from '@/app';
import { SearchEntitiesBlock } from '@/modules/card';
import { EntitySearchFilter, type EntityForm } from '@/modules/section';
import {
  EntityApiUtil,
  MyInput,
  PencilButton,
  type Entity,
  type EntityInfo,
  type EntityType,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { RefObject, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

const Root = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 8px;
`;

const IconWrapper = styled.div`
  height: 16px;
  width: auto;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    rect,
    circle,
    ellipse,
    path {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

const TitleWrapper = styled.div`
  /* to prevent flickering when toggling edit mode */
  height: 27px;
  width: 100%;

  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

interface Props {
  et: EntityType;
  entityForm: EntityForm;
  addEntityForm: (entity: Entity) => Promise<void>;
}

const AppointmentEntityBlockHeader = observer((props: Props) => {
  const { et, entityForm, addEntityForm } = props;

  const { t } = useTranslation('module.scheduler', {
    keyPrefix: 'scheduler.pages.scheduler_schedule_view_page.ui.add_appointment_modal',
  });

  const titleInputRef = useRef<HTMLInputElement>(null);

  const [isEditTitleMode, { toggle: toggleEditTitleMode, close: hideEditMode }] =
    useDisclosure(false);

  const { icon } = iconStore.getByName(et.section.icon);

  const title = entityForm.name;

  const handleSearchEntities = useCallback(
    async (title: string): Promise<EntityInfo[]> => {
      const dto = new EntitySearchFilter({
        name: title,
        fieldValue: title,
        entityTypeId: et.id,
        searchInLinked: true,
      });

      const result = await EntityApiUtil.searchEntities(dto);

      return result.entities;
    },
    [et.id]
  );

  const handleSelectEntity = async (selectedEntityId: number): Promise<void> => {
    const newEntity = await EntityApiUtil.getById(selectedEntityId);

    await addEntityForm(newEntity);

    if (entityForm) entityForm.originalEntity.isNew = false;
  };

  const editTitleButtonClick = () => {
    if (title.validate()) toggleEditTitleMode();
  };

  useOnClickOutside(titleInputRef as RefObject<HTMLInputElement>, e => {
    const target = e.target as HTMLElement;

    if (target.closest('.workspace__PencilButton--Root')) return;

    if (title.validate()) hideEditMode();
  });

  const noEntityOrNew = !entityForm || entityForm.originalEntity.isNew;

  return (
    <Root>
      <IconWrapper>{icon}</IconWrapper>

      {noEntityOrNew ? (
        <SearchEntitiesBlock
          inModal
          showIcons
          title={title}
          inputVariant="outlined"
          placeholder={t('placeholders.entity_name')}
          onSelectEntity={handleSelectEntity}
          handleSearchEntities={handleSearchEntities}
        />
      ) : (
        <TitleWrapper>
          {isEditTitleMode ? (
            <MyInput
              ref={titleInputRef}
              autoFocus
              model={title}
              alwaysActive
              variant="outlined"
              placeholder={t('placeholders.entity_name')}
            />
          ) : (
            <StyledLink
              target="_blank"
              to={routes.card({ entityTypeId: et.id, entityId: entityForm.id })}
            >
              {title.value}
            </StyledLink>
          )}
        </TitleWrapper>
      )}

      {!noEntityOrNew && <PencilButton active={isEditTitleMode} onClick={editTitleButtonClick} />}
    </Root>
  );
});

AppointmentEntityBlockHeader.displayName = 'AppointmentEntityBlockHeader';
export { AppointmentEntityBlockHeader };
