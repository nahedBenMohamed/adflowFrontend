import { DialogModalSecondary, SelectModel, StagesSelect } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ChangeStageIcon } from '../../../../../assets';
import { ActionModalBlock, BatchAction, SelectWrapper } from './components';

interface Props {
  updating: boolean;
  entityTypeId: number;
  handleBatchUpdate: ({
    responsibleId,
    responsibleEntityTypeIds,
    stageId,
  }: {
    responsibleId?: number;
    responsibleEntityTypeIds?: number[];
    stageId?: number;
  }) => Promise<void>;
}

const ChangeStageAction = observer((props: Props) => {
  const { updating, entityTypeId, handleBatchUpdate } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table.batch_actions',
  });

  const form = useLocalObservable(() => ({ stageId: SelectModel.create().required() }));

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const handleClose = () => {
    form.stageId = SelectModel.create().required();

    hide();
  };

  const handleApprove = async (): Promise<void> => {
    if (!form.stageId.validate()) return;

    await handleBatchUpdate({ stageId: form.stageId.value });

    handleClose();
  };

  return (
    <>
      <BatchAction
        active={opened}
        Icon={<ChangeStageIcon />}
        text={t('change_stage')}
        onClick={show}
      />

      {opened && (
        <DialogModalSecondary
          maxHeight="232px"
          isOpened={opened}
          loading={updating}
          approveDisabled={updating}
          Header={t('change_stage')}
          onClose={handleClose}
          onApprove={handleApprove}
        >
          <ActionModalBlock>
            {t('change_stage_annotation')}

            <SelectWrapper>
              <StagesSelect withinPortal model={form.stageId} entityTypeId={entityTypeId} />
            </SelectWrapper>
          </ActionModalBlock>
        </DialogModalSecondary>
      )}
    </>
  );
});

ChangeStageAction.displayName = 'ChangeStageAction';
export { ChangeStageAction };
