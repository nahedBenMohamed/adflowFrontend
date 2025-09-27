import { iconStore } from '@/app';
import { SchedulePerformerType } from '@/modules/scheduler';
import { departmentsSettingsStore } from '@/modules/settings';
import {
  DepartmentsSelect,
  MyInput,
  MyRadio,
  ParticipantsSelect,
  WarningModal,
  type Icon,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BuilderStepItemLabel,
  NameInputSkeleton,
  RadioWrapper,
  SectionIconPicker,
  type SchedulerSectionBuilderFormData,
} from '../../../../../../shared';
import type { SchedulerBuilderStore } from '../../../../../../store';
import { ContentWrapper } from '../ContentWrapper/ContentWrapper';
import { FormItemWrapper } from '../FormItemWrapper/FormItemWrapper';
import { RowWrapper } from '../RowWrapper/RowWrapper';

interface ShowHideHandlers {
  opened: boolean;
  show: () => void;
  hide: () => void;
}

interface Props {
  loading: boolean;
  sectionBuilderStore: SchedulerBuilderStore;
  formData: SchedulerSectionBuilderFormData;
}

const SchedulerBuilderStep1TopBlock = observer((props: Props) => {
  const { loading, sectionBuilderStore, formData } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix: 'builder.pages.scheduler_builder_page.scheduler_builder_step1',
  });

  const { icons } = iconStore;

  const [iconsDropdownOpened, { close: hideIconsDropdown, open: showIconsDropdown }] =
    useDisclosure(false);
  const [departmentsSelectOpened, { close: hideDepartmentsSelect, open: openDepartmentsSelect }] =
    useDisclosure(false);
  const [
    participantsSelectOpened,
    { close: hideParticipantsSelect, open: openParticipantsSelect },
  ] = useDisclosure(false);

  const [
    isChangePerformersWarningModalOpened,
    { open: openChangePerformersWarningModal, close: closeChangePerformersWarningModal },
  ] = useDisclosure(false);

  const departmentsSelectShowHideHandlers = useMemo<ShowHideHandlers>(
    () => ({
      opened: departmentsSelectOpened,
      show: openDepartmentsSelect,
      hide: hideDepartmentsSelect,
    }),
    [departmentsSelectOpened, hideDepartmentsSelect, openDepartmentsSelect]
  );

  const participantsSelectShowHideHandlers = useMemo<ShowHideHandlers>(
    () => ({
      opened: participantsSelectOpened,
      show: openParticipantsSelect,
      hide: hideParticipantsSelect,
    }),
    [hideParticipantsSelect, openParticipantsSelect, participantsSelectOpened]
  );

  const handleOpenChangePerformersWarningModal = useCallback(() => {
    openChangePerformersWarningModal();
    hideDepartmentsSelect();
    hideParticipantsSelect();
  }, [hideDepartmentsSelect, hideParticipantsSelect, openChangePerformersWarningModal]);

  const handleChangeIcon = useCallback(
    (icon: Icon) => {
      formData.setIcon(icon);

      hideIconsDropdown();
    },
    [formData, hideIconsDropdown]
  );

  const handleChangeParticipants = useCallback(() => {
    formData.performerIdsGroups.values = [];
    formData.performerType.value = SchedulePerformerType.USER;

    if (sectionBuilderStore.isDestructiveUpdate) handleOpenChangePerformersWarningModal();
  }, [
    formData.performerIdsGroups,
    formData.performerType,
    handleOpenChangePerformersWarningModal,
    sectionBuilderStore.isDestructiveUpdate,
  ]);

  const handleChangeDepartments = useCallback(() => {
    formData.performerIdsUsers.values = [];
    formData.performerType.value = SchedulePerformerType.DEPARTMENT;

    if (sectionBuilderStore.isDestructiveUpdate) handleOpenChangePerformersWarningModal();
  }, [
    formData.performerIdsUsers,
    formData.performerType,
    handleOpenChangePerformersWarningModal,
    sectionBuilderStore.isDestructiveUpdate,
  ]);

  const handleChangePerformerType = useCallback(
    (value: string) => {
      if (value === SchedulePerformerType.USER) {
        formData.performerIdsGroups.isValid = true;
        formData.performerIdsGroups.values = [];
      } else {
        formData.performerIdsUsers.isValid = true;
        formData.performerIdsUsers.values = [];
      }

      if (sectionBuilderStore.isDestructiveUpdate) handleOpenChangePerformersWarningModal();
    },
    [
      formData.performerIdsGroups,
      formData.performerIdsUsers,
      handleOpenChangePerformersWarningModal,
      sectionBuilderStore.isDestructiveUpdate,
    ]
  );

  const handleApproveChangingPerformers = useCallback(() => {
    closeChangePerformersWarningModal();
  }, [closeChangePerformersWarningModal]);

  const handleCancelChangingPerformers = useCallback(() => {
    if (sectionBuilderStore.schedule) {
      sectionBuilderStore.formData.performerType.setValue(
        sectionBuilderStore.schedule.performersType
      );

      if (sectionBuilderStore.schedule.performersType === SchedulePerformerType.USER) {
        sectionBuilderStore.formData.performerIdsUsers.setValue(
          sectionBuilderStore.schedule.performers.map(p => p.userId).filter(Boolean)
        );
        sectionBuilderStore.formData.performerIdsGroups.setValue([]);
        formData.performerIdsGroups.isValid = true;
      } else {
        sectionBuilderStore.formData.performerIdsGroups.setValue(
          sectionBuilderStore.schedule.performers.map(p => p.departmentId).filter(Boolean)
        );
        sectionBuilderStore.formData.performerIdsUsers.setValue([]);
        formData.performerIdsUsers.isValid = true;
      }
    }

    closeChangePerformersWarningModal();
  }, [
    sectionBuilderStore.schedule,
    sectionBuilderStore.formData.performerType,
    sectionBuilderStore.formData.performerIdsUsers,
    sectionBuilderStore.formData.performerIdsGroups,
    closeChangePerformersWarningModal,
    formData.performerIdsGroups,
    formData.performerIdsUsers,
  ]);

  return (
    <ContentWrapper>
      <RowWrapper>
        <FormItemWrapper>
          <BuilderStepItemLabel label={t('name_the_module')} hint={t('name_the_module_hint')} />

          {loading ? (
            <NameInputSkeleton $delay={0} />
          ) : (
            <MyInput
              autoFocus
              width="70%"
              variant="outlined"
              whitespaceClearing
              model={formData.name}
              placeholder={t('placeholders.module_name')}
            />
          )}
        </FormItemWrapper>

        <FormItemWrapper>
          <BuilderStepItemLabel label={t('choose_icon')} hint={t('choose_icon_hint')} />

          <SectionIconPicker
            icons={icons}
            selectedIcon={formData.icon}
            opened={iconsDropdownOpened}
            moduleColor={iconStore.schedulerColor}
            hide={hideIconsDropdown}
            show={showIconsDropdown}
            chooseIcon={handleChangeIcon}
          />
        </FormItemWrapper>
      </RowWrapper>

      <BuilderStepItemLabel label={t('for_whom')} hint={t('for_whom_hint')} />

      <RowWrapper>
        <FormItemWrapper>
          <RadioWrapper>
            <MyRadio
              model={formData.performerType}
              value={SchedulePerformerType.USER}
              handleChange={handleChangePerformerType}
            />

            <BuilderStepItemLabel label={t('for_users')} />
          </RadioWrapper>

          <ParticipantsSelect
            withinPortal
            model={formData.performerIdsUsers}
            showPlaceholder={!formData.performerIdsUsers.values.length}
            overrideShowHideHandlers={participantsSelectShowHideHandlers}
            handleChange={handleChangeParticipants}
          />
        </FormItemWrapper>

        <FormItemWrapper>
          <RadioWrapper>
            <MyRadio
              model={formData.performerType}
              value={SchedulePerformerType.DEPARTMENT}
              handleChange={handleChangePerformerType}
            />

            <BuilderStepItemLabel label={t('for_user_groups')} />
          </RadioWrapper>

          <DepartmentsSelect
            withinPortal
            width="356px"
            model={formData.performerIdsGroups}
            variant="outlined-without-active-shadow"
            departments={departmentsSettingsStore.departments}
            overrideShowHideHandlers={departmentsSelectShowHideHandlers}
            handleChange={handleChangeDepartments}
          />
        </FormItemWrapper>
      </RowWrapper>

      {isChangePerformersWarningModalOpened && (
        <WarningModal
          isDanger
          icon="warning"
          maxHeight="100%"
          height="fit-content"
          title={t('change_performers_warning.title')}
          isOpened={isChangePerformersWarningModalOpened}
          approveTitle={t('change_performers_warning.approve')}
          annotation={t('change_performers_warning.annotation')}
          onCancel={handleCancelChangingPerformers}
          onApprove={handleApproveChangingPerformers}
          onClose={closeChangePerformersWarningModal}
        />
      )}
    </ContentWrapper>
  );
});

export { SchedulerBuilderStep1TopBlock };
