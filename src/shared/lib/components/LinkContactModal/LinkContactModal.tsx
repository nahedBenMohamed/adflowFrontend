import { entityTypeStore } from '@/app';
import { SearchEntitiesBlock } from '@/modules/card';
import { UpdateGroupChatDto } from '@/modules/multichat/api';
import { EntitySearchFilter } from '@/modules/section';
import {
  DialogModalSecondary,
  EntityApiUtil,
  type EntityInfo,
  InputModel,
  MyCheckbox,
  MySelect,
  Nullable,
  SelectModel,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  overflow-y: auto;
  height: 100%;

  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 16px 32px;
`;

const FormItem = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

const EntityName = styled.div`
  font-size: 14px;
  font-weight: 600;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);
`;

const NavigateWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
  linkContact: ({
    entityTypeId,
    dto,
    navigateToCard,
  }: {
    dto: UpdateGroupChatDto;
    entityTypeId: number;
    navigateToCard: boolean;
  }) => Promise<void>;
}

interface InitialForm {
  name: InputModel;
  entity: Nullable<EntityInfo>;
  entityTypeId: SelectModel;
  navigateToCard: boolean;
}

const LinkContactModal = observer((props: Props) => {
  const { isOpened, onClose, linkContact } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.pages.mailing_page.components.modals.link_contact_modal',
  });

  const form = useLocalObservable<InitialForm>(() => ({
    entity: null,
    name: InputModel.create(),
    navigateToCard: true,
    entityTypeId: SelectModel.create(),
  }));

  const entityTypeOptions = entityTypeStore.entityTypesOptions;

  const handleChangeNavigateToCardCheckbox = () => (form.navigateToCard = !form.navigateToCard);

  const [approving, setApproving] = useState(false);

  const handleApprove = async (): Promise<void> => {
    try {
      setApproving(true);

      if (!form.entity) return;

      const dto = UpdateGroupChatDto.create({
        entityId: form.entity.id,
      });

      await linkContact({
        dto,
        entityTypeId: form.entityTypeId.value,
        navigateToCard: form.navigateToCard,
      });
    } finally {
      setApproving(false);
    }
  };

  const onSearchEntities = useCallback(
    async (title: string): Promise<EntityInfo[]> => {
      const dto = new EntitySearchFilter({ entityTypeId: form.entityTypeId.value, name: title });

      const result = await EntityApiUtil.searchEntities(dto);

      return result.entities;
    },
    [form.entityTypeId.value]
  );

  const handleSelectEntity = useCallback(
    async (entity: EntityInfo): Promise<void> => {
      form.entity = entity;
    },
    [form]
  );

  return (
    <DialogModalSecondary
      width="440px"
      maxHeight="384px"
      isOpened={isOpened}
      loading={approving}
      Header={t('title')}
      approveTitle={t('link')}
      approveDisabled={!form.entity}
      onClose={onClose}
      onApprove={handleApprove}
    >
      <Root>
        <FormItem>
          <Label>{t('select_module')}</Label>

          <MySelect
            withinPortal
            variant="outlined"
            model={form.entityTypeId}
            options={entityTypeOptions}
            placeholder={t('placeholders.module')}
          />
        </FormItem>

        <FormItem>
          <Label>{t('search_card')}</Label>

          <SearchEntitiesBlock
            withinPortal
            title={form.name}
            inputVariant="outlined"
            placeholder={t('placeholders.search_card')}
            onSelectEntityFull={handleSelectEntity}
            handleSearchEntities={onSearchEntities}
          />

          {form.entity && <EntityName>{form.entity.name}</EntityName>}
        </FormItem>

        <NavigateWrapper>
          <MyCheckbox checked={form.navigateToCard} onChange={handleChangeNavigateToCardCheckbox} />

          <FormItem>
            <Label>{t('open_entity')}</Label>
          </FormItem>
        </NavigateWrapper>
      </Root>
    </DialogModalSecondary>
  );
});

export { LinkContactModal };
