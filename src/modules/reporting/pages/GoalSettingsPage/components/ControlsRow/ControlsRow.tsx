import { routes, userStore } from '@/app';
import {
  BackLink,
  MySelect,
  SectionView,
  SelectModel,
  UsersMultiselect,
  WarningModal,
  type MultiselectModel,
  type Option,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ArrowBackIcon, Periods } from '../../../../shared';
import { PeriodControl } from '../PeriodControl/PeriodControl';

const Root = styled.div`
  position: relative;

  width: 100%;

  display: flex;
  justify-content: center;
  gap: 16px;
`;

const BackLinkWrapper = styled.div`
  position: absolute;
  left: 0;

  padding: 4px;
`;

const Content = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-blue-hover);

    svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    color: var(--button-text-blue-active);

    svg path {
      fill: var(--button-text-blue-active);
    }
  }
`;

const SELECT_WIDTH = 187;

interface Props {
  etId: number;
  usersModel: MultiselectModel<number>;
  selectedPeriodType: Periods;
  currentPeriod: number;
  currentYear: number;
  onPeriodTypeSelect: (periodType: Periods) => void;
  onNextPeriod: () => void;
  onPrevPeriod: () => void;
  handleChangeUsers: (userIds: number[]) => void;
  deleteAllGoals: () => Promise<void>;
}

const ControlsRow = (props: Props) => {
  const {
    etId,
    usersModel,
    selectedPeriodType,
    currentPeriod,
    currentYear,
    onPeriodTypeSelect,
    handleChangeUsers,
    onNextPeriod,
    onPrevPeriod,
    deleteAllGoals,
  } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.goal_settings_page',
  });

  const [warningModalOpened, { close: hideWarningModal, open: showWarningModal }] =
    useDisclosure(false);

  const periodTypeModel = SelectModel.create(selectedPeriodType);
  const periodTypeOptions = useMemo<Option<Periods>[]>(
    () =>
      Object.values(Periods).map(p => ({
        label: t(`period_type.${p}`),
        value: p,
      })),
    [t]
  );

  const handleChangePeriodTypeApprove = async (): Promise<void> => {
    await deleteAllGoals();

    periodTypeModel.setValue(
      selectedPeriodType === Periods.MONTH ? Periods.QUARTER : Periods.MONTH
    );
    onPeriodTypeSelect(periodTypeModel.value);

    hideWarningModal();
  };

  return (
    <>
      <Root>
        <BackLinkWrapper>
          <BackLink
            backLink={routes.entitiesSection({
              entityTypeId: etId,
              tab: SectionView.DASHBOARD,
            })}
          >
            <Content>
              <ArrowBackIcon />

              {t('back_button')}
            </Content>
          </BackLink>
        </BackLinkWrapper>

        <UsersMultiselect
          variant="outlined"
          model={usersModel}
          titleWidth={`${SELECT_WIDTH}px`}
          users={userStore.activeUsers}
          fixedDropdownWidth={SELECT_WIDTH}
          handleChange={handleChangeUsers}
        />

        <MySelect
          variant="outlined"
          model={periodTypeModel}
          width={`${SELECT_WIDTH}px`}
          options={periodTypeOptions}
          handleChange={showWarningModal}
        />

        <PeriodControl
          width={SELECT_WIDTH}
          current={currentPeriod}
          currentYear={currentYear}
          periodType={selectedPeriodType}
          onNext={onNextPeriod}
          onPrev={onPrevPeriod}
        />
      </Root>

      <WarningModal
        icon="warning"
        maxHeight="360px"
        isOpened={warningModalOpened}
        title={t('change_period_modal.title')}
        cancelTitle={t('change_period_modal.cancel')}
        approveTitle={t('change_period_modal.approve')}
        annotation={t('change_period_modal.annotation')}
        onClose={hideWarningModal}
        onApprove={handleChangePeriodTypeApprove}
      />
    </>
  );
};

export { ControlsRow };
