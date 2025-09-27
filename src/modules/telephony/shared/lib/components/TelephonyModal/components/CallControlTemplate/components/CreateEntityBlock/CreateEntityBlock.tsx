import { entityTypeStore, routes } from '@/app';
import { SimpleFieldValueDto } from '@/modules/fields';
import { CreateSimpleEntityDto } from '@/modules/section';
import {
  EntityApiUtil,
  EntityCategory,
  FieldType,
  MySelect,
  PrimaryButton,
  SelectModel,
  type EntityType,
  type Nullable,
  type Option,
} from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTelephonyContext } from '../../../../../../../../context';
import { voximplantConnectorStore } from '../../../../../../../../store';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  phoneNumber: string;
}

interface CreateEntityForm {
  model: SelectModel;
  entityTypeId: Nullable<number>;
  linkedEntityTypeId: Nullable<number>;
}

type PossibleCreateEntityOptionExtra = { entityTypeId: number; linkedEntityTypeId: null };
type PossibleCreateEntityOptionExtraWithLinked = {
  entityTypeId: number;
  linkedEntityTypeId: number;
};

type PossibleCreateEntityOption =
  | Option<number, PossibleCreateEntityOptionExtra>
  | Option<string, PossibleCreateEntityOptionExtraWithLinked>;

const CreateEntityBlock = observer((props: Props) => {
  const { phoneNumber } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.components.telephony_modal.call_control_template',
  });

  const navigate = useNavigate();

  const { fold } = useTelephonyContext();

  const [creating, setCreating] = useState(false);

  const form = useLocalObservable<CreateEntityForm>(() => ({
    model: SelectModel.create().required(),
    entityTypeId: null,
    linkedEntityTypeId: null,
  }));

  const options = useMemo<PossibleCreateEntityOption[]>(() => {
    const availableEts = entityTypeStore.getAvailableEntityTypes();

    const contactsEt = availableEts.filter(et => et.entityCategory === EntityCategory.CONTACT);
    const companiesEt = availableEts.filter(et => et.entityCategory === EntityCategory.COMPANY);

    const getOptions = (ets: EntityType[]): Option<number, PossibleCreateEntityOptionExtra>[] =>
      ets.map(et => ({
        label: et.name,
        value: et.id,
        extra: {
          entityTypeId: et.id,
          linkedEntityTypeId: null,
        },
      }));

    const getWithDealOptions = (
      ets: EntityType[]
    ): Option<string, PossibleCreateEntityOptionExtraWithLinked>[] =>
      ets.flatMap(et =>
        et.linkedEntityTypes
          .map(l => entityTypeStore.getById(l.targetId))
          .filter(et => et.entityCategory === EntityCategory.DEAL)
          .map(deal => ({
            label: `${et.name} + ${deal.name}`,
            value: `${et.id}–${deal.id}`,
            extra: {
              entityTypeId: et.id,
              linkedEntityTypeId: deal.id,
            },
          }))
      );

    return [
      ...getOptions(contactsEt),
      ...getOptions(companiesEt),
      ...getWithDealOptions(contactsEt),
      ...getWithDealOptions(companiesEt),
    ];
  }, []);

  const handleChange = useCallback(
    (option: PossibleCreateEntityOption) => {
      const extra = option.extra;

      form.entityTypeId = extra?.entityTypeId ?? null;
      form.linkedEntityTypeId = extra?.linkedEntityTypeId ?? null;
    },
    [form]
  );

  const handleCreateEntity = useCallback(async (): Promise<void> => {
    if (!form.model.validate() || !form.entityTypeId) return;

    const etId = form.entityTypeId;

    const phoneFieldDto = new SimpleFieldValueDto({
      fieldType: FieldType.PHONE,
      payload: {
        values: [phoneNumber],
      },
    });

    let dto = new CreateSimpleEntityDto({ entityTypeId: etId, fieldValues: [phoneFieldDto] });

    if (form.linkedEntityTypeId) {
      dto = new CreateSimpleEntityDto({
        entityTypeId: form.linkedEntityTypeId,
        fieldValues: null,
        linkedEntities: [dto],
      });
    }

    try {
      setCreating(true);

      const [createdEntity, createdLinkedEntity] = await EntityApiUtil.createSimple(dto);

      // invalidate call cache to update call modal view
      if (createdLinkedEntity && createdEntity) {
        voximplantConnectorStore.setEntityInfo(createdLinkedEntity);

        voximplantConnectorStore.setLinkedEntityInfo(createdEntity);
      } else if (createdEntity) {
        voximplantConnectorStore.setEntityInfo(createdEntity);
      }

      if (createdEntity) {
        navigate(
          routes.card({ entityTypeId: createdEntity.entityTypeId, entityId: createdEntity.id })
        );

        fold();
      }
    } catch (e) {
      throw new Error(`Error while creating simple entity from call ${phoneNumber}: ${e}`);
    } finally {
      setCreating(false);
    }
  }, [phoneNumber, form, navigate, fold]);

  return options.length > 0 ? (
    <Root>
      <MySelect
        withinPortal
        width="240px"
        options={options}
        model={form.model}
        variant="outlined-without-active-shadow"
        placeholder={t('placeholders.select_card')}
        handleChangeOption={handleChange}
      />

      <PrimaryButton disabled={creating} loading={creating} onClick={handleCreateEntity}>
        {t('create')}
      </PrimaryButton>
    </Root>
  ) : null;
});

CreateEntityBlock.displayName = 'CreateEntityBlock';
export { CreateEntityBlock };
