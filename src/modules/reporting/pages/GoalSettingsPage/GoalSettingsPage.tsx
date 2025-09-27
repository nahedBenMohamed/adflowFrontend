import { appStore, entityTypeStore, iconStore, SettingsStore } from '@/app';
import {
  debounce,
  DefaultHeader,
  LeftNavTemplate,
  MultiselectModel,
  TutorialProductType,
  useTypedParams,
  UtcDate,
  WholePageLoaderWithLogo,
  type DefaultHeaderModuleIconProps,
  type EntityType,
  type Optional,
} from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ChartType,
  Periods,
  SalesGoalModel,
  SalesGoalSettings,
  Speedometer,
  type GoalSettingsPageSettings,
  type SalesPlan,
} from '../../shared';
import { GoalSettingsStore } from '../../store';
import { ControlsRow, GoalSettingsForm } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;

  padding: 16px 0;
`;

const GOAL_SETTINGS_PAGE_SETTINGS_KEY = 'GoalSettingsPageSettings';

const { settings } = SettingsStore.getSettingsStore<{ settings: GoalSettingsPageSettings[] }>(
  GOAL_SETTINGS_PAGE_SETTINGS_KEY
);

if (!settings.settings) {
  settings.settings = [];
}

const chartType = (et: EntityType): ChartType => {
  switch (true) {
    case et.isSupplierCategory():
    case et.isContractorCategory():
      return ChartType.ORDERS;

    case et.isHRCategory():
      return ChartType.CANDIDATES;

    default:
      return ChartType.SALES;
  }
};

const GoalSettingsPage = observer(() => {
  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.goal_settings_page',
  });

  const { entityTypeId } = useTypedParams<{ entityTypeId: number }>();

  const savedSettings: Optional<GoalSettingsPageSettings> = settings.settings
    ? settings.settings.find(s => s.etId === entityTypeId)
    : undefined;

  const dateNow = UtcDate.now();

  const [period, setPeriod] = useState<Periods>(
    savedSettings?.settings.periodType ?? Periods.MONTH
  );
  const [yearWithMonth, setYearWithMonth] = useState<number>(
    savedSettings?.settings.yearWithMonth ?? dateNow.year
  );
  const [month, setMonth] = useState<number>(savedSettings?.settings.month ?? dateNow.month);
  const [yearWithQuarter, setYearWithQuarter] = useState<number>(
    savedSettings?.settings.yearWithQuarter ?? dateNow.year
  );
  const [quarter, setQuarter] = useState<number>(
    savedSettings?.settings.quarter ?? Math.floor((dateNow.month + 3) / 3 - 1)
  );

  const goalSettingsStore = useMemo(
    () =>
      new GoalSettingsStore({
        etId: entityTypeId,
        startDate: UtcDate.fromDate(
          new Date(
            period === 'month' ? yearWithMonth : yearWithQuarter,
            period === 'month' ? month : quarter * 3,
            1
          )
        ).formatISOWithoutUnix(),
        endDate: UtcDate.fromDate(
          new Date(
            period === 'month' ? yearWithMonth : yearWithQuarter,
            period === 'month' ? month + 1 : quarter * 3 + 3,
            0
          )
        )
          .endOfDay()
          .formatISOWithoutUnix(),
      }),
    [entityTypeId, month, quarter, period, yearWithMonth, yearWithQuarter]
  );

  const {
    goals,
    endDate,
    startDate,
    totalAmount,
    totalQuantity,
    currentTotalAmount,
    currentTotalQuantity,
    loadData,
    updateData,
    addUsersGoals,
    pickAddedUsers,
    deleteAllGoals,
    deleteUserGoals,
    pickDeletedUsers,
    updateUsersGoals,
  } = goalSettingsStore;

  const saveSettings = useCallback(() => {
    const updatedSettings = new SalesGoalSettings({
      month,
      quarter,
      yearWithMonth,
      yearWithQuarter,
      periodType: period,
    });

    const savedSettings = settings.settings ?? [];

    settings.settings = [
      ...savedSettings.filter(s => s.etId !== entityTypeId),
      {
        etId: entityTypeId,
        settings: updatedSettings,
      },
    ];
  }, [entityTypeId, period, month, quarter, yearWithMonth, yearWithQuarter]);

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => {
        loadData();
        saveSettings();
      }
    );
  }, [entityTypeId, period, month, quarter, loadData, saveSettings]);

  const usersModel = MultiselectModel.create(goals ? goals.map(up => up.userId) : []);

  const speedometerModel = SalesGoalModel.create(
    { current: currentTotalAmount, goal: totalAmount },
    { current: currentTotalQuantity, goal: totalQuantity }
  );

  const onNextPeriod = () => {
    if (period === 'month') {
      if (month < 11) {
        setMonth(prev => ++prev);

        return;
      }

      setMonth(0);
      setYearWithMonth(prev => ++prev);
    } else {
      if (quarter < 3) {
        setQuarter(prev => ++prev);

        return;
      }

      setQuarter(0);
      setYearWithQuarter(prev => ++prev);
    }
  };

  const onPrevPeriod = () => {
    if (period === 'month') {
      if (month > 0) {
        setMonth(prev => --prev);

        return;
      }

      setMonth(11);
      setYearWithMonth(prev => --prev);
    } else {
      if (quarter > 0) {
        setQuarter(prev => --prev);

        return;
      }

      setQuarter(3);
      setYearWithQuarter(prev => --prev);
    }
  };

  const handleChangeUsers = useCallback(
    (userIds: number[]) => {
      const addedUsers = pickAddedUsers(userIds);

      if (addedUsers.length) {
        const usersGoals = addedUsers.map(uId => {
          return {
            userId: uId,
            period: {
              startDate: startDate,
              endDate: endDate,
            },
            amount: 0,
            quantity: 0,
          };
        });

        addUsersGoals(usersGoals);
      } else {
        const deletedUsers = pickDeletedUsers(userIds);

        deletedUsers.forEach(uId => {
          deleteUserGoals(uId);
        });
      }
    },
    [startDate, endDate, addUsersGoals, deleteUserGoals, pickAddedUsers, pickDeletedUsers]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateData = useCallback(debounce(updateData, 500), []);

  const updateGoals = (usersGoals: SalesPlan[]) => {
    updateUsersGoals(usersGoals);

    debouncedUpdateData(usersGoals);
  };

  const getModuleIconProps = useCallback(
    (et: EntityType): DefaultHeaderModuleIconProps => ({
      icon: iconStore.getByName(et.section.icon).icon,
      color: iconStore.getEntityColorByEntityCategory(et.entityCategory),
    }),
    []
  );

  if (!appStore.isLoaded) return <WholePageLoaderWithLogo />;

  const et = entityTypeStore.getById(entityTypeId);

  return (
    <LeftNavTemplate
      Header={
        <DefaultHeader
          moduleName={t('title')}
          objectId={entityTypeId}
          moduleIconProps={getModuleIconProps(et)}
          productType={TutorialProductType.ENTITY_TYPE}
        />
      }
    >
      <Root>
        <ControlsRow
          etId={entityTypeId}
          usersModel={usersModel}
          selectedPeriodType={period}
          currentPeriod={period === 'month' ? month : quarter}
          currentYear={period === 'month' ? yearWithMonth : yearWithQuarter}
          onNextPeriod={onNextPeriod}
          onPrevPeriod={onPrevPeriod}
          onPeriodTypeSelect={setPeriod}
          deleteAllGoals={deleteAllGoals}
          handleChangeUsers={handleChangeUsers}
        />

        <Speedometer model={speedometerModel} chartType={chartType(et)} />

        <GoalSettingsForm
          usersGoals={goals}
          chartType={chartType(et)}
          totalAmount={totalAmount}
          totalQuantity={totalQuantity}
          updateUsersGoals={updateGoals}
        />
      </Root>
    </LeftNavTemplate>
  );
});

GoalSettingsPage.displayName = 'GoalSettingsPage';
export { GoalSettingsPage };
