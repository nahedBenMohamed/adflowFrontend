import { ScheduleType } from '@/modules/scheduler';
import { envUtil, MyRadio, WarningModal } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BuilderStepItemLabel, LoadableSectionImage, RadioWrapper } from '../../../../../../shared';
import type { SchedulerBuilderStore } from '../../../../../../store';
import { ContentWrapper } from '../ContentWrapper/ContentWrapper';
import { FormItemWrapper } from '../FormItemWrapper/FormItemWrapper';
import { RowWrapper } from '../RowWrapper/RowWrapper';

interface Props {
  sectionBuilderStore: SchedulerBuilderStore;
}

const SchedulerBuilderStep1TypeBlock = observer((props: Props) => {
  const { sectionBuilderStore } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.scheduler_builder_step1',
  });

  const [
    isChangeTypeWarningModalOpened,
    { open: openChangeTypeWarningModal, close: closeChangeTypeWarningModal },
  ] = useDisclosure(false);

  const handleChangeType = useCallback(() => {
    if (sectionBuilderStore.isDestructiveUpdate) openChangeTypeWarningModal();
  }, [openChangeTypeWarningModal, sectionBuilderStore.isDestructiveUpdate]);

  const handleApproveChangingType = useCallback(() => {
    closeChangeTypeWarningModal();
  }, [closeChangeTypeWarningModal]);

  const handleCancelChangingType = useCallback(() => {
    if (sectionBuilderStore.schedule)
      sectionBuilderStore.formData.scheduleType.setValue(sectionBuilderStore.schedule.type);

    closeChangeTypeWarningModal();
  }, [
    sectionBuilderStore.schedule,
    sectionBuilderStore.formData.scheduleType,
    closeChangeTypeWarningModal,
  ]);

  return (
    <ContentWrapper>
      <BuilderStepItemLabel label={t('view_type')} hint={t('view_type_hint')} />

      <RowWrapper>
        <FormItemWrapper as="label">
          <RadioWrapper>
            <MyRadio
              value={ScheduleType.SCHEDULE}
              model={sectionBuilderStore.formData.scheduleType}
              handleChange={handleChangeType}
            />

            <BuilderStepItemLabel label={t('schedule')} />
          </RadioWrapper>

          <LoadableSectionImage
            alt={t('schedule_img_alt', { company: envUtil.appName })}
            src="/images/builder/scheduler-view/schedule.png"
          />
        </FormItemWrapper>

        <FormItemWrapper as="label">
          <RadioWrapper>
            <MyRadio
              value={ScheduleType.BOARD}
              model={sectionBuilderStore.formData.scheduleType}
              handleChange={handleChangeType}
            />

            <BuilderStepItemLabel label={t('board')} />
          </RadioWrapper>

          <LoadableSectionImage
            alt={t('board_img_alt', { company: envUtil.appName })}
            src="/images/builder/scheduler-view/board.png"
          />
        </FormItemWrapper>
      </RowWrapper>

      {isChangeTypeWarningModalOpened && (
        <WarningModal
          isDanger
          icon="warning"
          maxHeight="100%"
          height="fit-content"
          title={t('change_type_warning.title')}
          isOpened={isChangeTypeWarningModalOpened}
          approveTitle={t('change_type_warning.approve')}
          annotation={t('change_type_warning.annotation')}
          onCancel={handleCancelChangingType}
          onApprove={handleApproveChangingType}
          onClose={closeChangeTypeWarningModal}
        />
      )}
    </ContentWrapper>
  );
});

export { SchedulerBuilderStep1TypeBlock };
