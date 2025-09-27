import { entityTypeStore, userStore } from '@/app';
import {
  CheckboxModel,
  DialogModalSecondary,
  MyUsersSelect,
  SelectModel,
  type EntityType,
  type EntityTypeLink,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ChangeResponsibleIcon } from '../../../../../assets';
import { ActionModalBlock, BatchAction, LinkedEntitiesSelect, SelectWrapper } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const Delimiter = styled.hr`
  width: 100%;
  border-top: 1px solid var(--graphite-graphite-80);
`;

interface InitialForm {
  responsibleId: SelectModel;
  responsibleEntityTypeIds: CheckboxModel;
}

interface Props {
  updating: boolean;
  linkedEntityTypesLinks: EntityTypeLink[];
  handleBatchUpdate: ({
    stageId,
    responsibleId,
    responsibleEntityTypeIds,
  }: {
    stageId?: number;
    responsibleId?: number;
    responsibleEntityTypeIds?: number[];
  }) => Promise<void>;
}

const ChangeResponsibleAction = (props: Props) => {
  const { updating, linkedEntityTypesLinks, handleBatchUpdate } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table.batch_actions',
  });

  const form = useLocalObservable<InitialForm>(() => ({
    responsibleId: SelectModel.create().required(),
    responsibleEntityTypeIds: CheckboxModel.create([]),
  }));

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const linkedEntityTypes = useMemo<EntityType[]>(
    () => linkedEntityTypesLinks.map(l => entityTypeStore.getById(l.targetId)),
    [linkedEntityTypesLinks]
  );

  const handleClose = useCallback(() => {
    form.responsibleId = SelectModel.create().required();
    form.responsibleEntityTypeIds = CheckboxModel.create([]);

    hide();
  }, [form, hide]);

  const handleApprove = async (): Promise<void> => {
    if (!form.responsibleId.validate()) return;

    await handleBatchUpdate({
      responsibleId: form.responsibleId.value,
      responsibleEntityTypeIds: form.responsibleEntityTypeIds.valuesOrUndefined,
    });

    handleClose();
  };

  return (
    <>
      <BatchAction
        active={opened}
        text={t('change_responsible')}
        Icon={<ChangeResponsibleIcon />}
        onClick={show}
      />

      {opened && (
        <DialogModalSecondary
          width="390px"
          isOpened={opened}
          maxHeight="416px"
          loading={updating}
          height="fit-content"
          approveDisabled={updating}
          Header={t('change_responsible')}
          onClose={handleClose}
          onApprove={handleApprove}
        >
          <Root>
            <ActionModalBlock>
              <strong>{t('action_cannot_be_undone')}</strong>

              {t('change_responsible_annotation')}

              <SelectWrapper>
                <MyUsersSelect
                  withinPortal
                  variant="outlined"
                  model={form.responsibleId}
                  users={userStore.activeUsers}
                />
              </SelectWrapper>

              <Delimiter />

              {linkedEntityTypes.length > 0 && (
                <>
                  {t('select_linked_entities_annotation')}

                  <LinkedEntitiesSelect
                    linkedEntityTypes={linkedEntityTypes}
                    responsibleEntityTypeIds={form.responsibleEntityTypeIds}
                  />
                </>
              )}
            </ActionModalBlock>
          </Root>
        </DialogModalSecondary>
      )}
    </>
  );
};

export { ChangeResponsibleAction };
