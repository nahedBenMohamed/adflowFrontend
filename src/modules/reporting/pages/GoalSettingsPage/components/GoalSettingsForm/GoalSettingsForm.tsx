import { userStore } from '@/app';
import { departmentsSettingsStore } from '@/modules/settings';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  ChartType,
  type DepartmentWithUsersOption,
  type GoalType,
  type ReportingOption,
  type SalesPlan,
  type SalesPlanWithUser,
  type SubdepartmentWithUsersOption,
} from '../../../../shared';
import { GoalSettingsFormItem } from '../GoalSettingsFormItem/GoalSettingsFormItem';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const HeaderItem = styled.div`
  width: 152px;

  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  text-transform: uppercase;
  color: var(--button-text-graphite-secondary-text);
`;

const HeaderWrapper = styled.div`
  width: 680px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 0 24px 24px;
`;

const DepartmentRawWrapper = styled.div`
  margin: 24px 0;
`;

const SubGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 24px 0;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const DepartmentGroup = styled.div`
  width: 680px;

  display: flex;
  flex-direction: column;

  padding: 0 24px;
  background-color: var(--primary-statuses-white-0);
  border-radius: var(--border-radius-block);
  border: 1px solid var(--graphite-graphite-80);

  ${SubGroup}:last-child {
    border-bottom: none;
  }
`;

interface Props {
  usersGoals: SalesPlan[];
  totalAmount: number;
  chartType: ChartType;
  totalQuantity: number;
  updateUsersGoals: (usersGoals: SalesPlan[]) => void;
}

const GoalSettingsForm = observer((props: Props) => {
  const { usersGoals, chartType, totalAmount, totalQuantity, updateUsersGoals } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.pages.goal_settings_page',
  });

  const usersGoalsWithUser = usersGoals.map<SalesPlanWithUser>(d => ({
    ...d,
    user: userStore.getActiveById(d.userId),
  }));

  const { departments } = departmentsSettingsStore;

  const usersWithoutDepartmentOptions = useMemo<ReportingOption[]>(
    () =>
      usersGoalsWithUser
        .filter(up => !up.user.departmentId)
        .map<ReportingOption>(up => ({
          userId: up.userId,
          fullName: up.user.fullName,
          amount: up.amount,
          quantity: up.quantity,
        })),
    [usersGoalsWithUser]
  );

  const options = useMemo<DepartmentWithUsersOption[]>(
    () =>
      departments.map<DepartmentWithUsersOption>(d => {
        const subs = d.subordinates.map<SubdepartmentWithUsersOption>(sub => ({
          id: sub.id,
          name: sub.name,
          options: usersGoalsWithUser
            .filter(up => up.user.departmentId === sub.id)
            .map(up => ({
              userId: up.userId,
              fullName: up.user.fullName,
              amount: up.amount,
              quantity: up.quantity,
            })),
          amount: usersGoalsWithUser
            .filter(up => up.user.departmentId === sub.id)
            .reduce((acc, up) => acc + up.amount, 0),
          quantity: usersGoalsWithUser
            .filter(up => up.user.departmentId === sub.id)
            .reduce((acc, up) => acc + up.quantity, 0),
        }));

        return {
          department: {
            id: d.id,
            name: d.name,
            options: usersGoalsWithUser
              .filter(up => up.user.departmentId === d.id)
              .map(up => ({
                userId: up.userId,
                fullName: up.user.fullName,
                amount: up.amount,
                quantity: up.quantity,
              })),
            amount:
              usersGoalsWithUser
                .filter(up => up.user.departmentId === d.id)
                .reduce((acc, up) => acc + up.amount, 0) +
              subs.reduce((acc, sub) => acc + sub.amount, 0),
            quantity:
              usersGoalsWithUser
                .filter(up => up.user.departmentId === d.id)
                .reduce((acc, up) => acc + up.quantity, 0) +
              subs.reduce((acc, sub) => acc + sub.quantity, 0),
          },
          subdepartments: subs,
        };
      }),
    [usersGoalsWithUser, departments]
  );

  const showThisDepartment = (department: DepartmentWithUsersOption): boolean => {
    if (
      !department.department.options.length &&
      !department.subdepartments.some(s => showThisSubdepartment(s))
    )
      return false;

    return true;
  };

  const showThisSubdepartment = (subdepartment: SubdepartmentWithUsersOption): boolean => {
    return subdepartment.options.length > 0;
  };

  const updateUserGoals = (userId: number, goalType: GoalType, value: number) => {
    const updatedUserGoals = usersGoals.find(u => u.userId === userId);

    if (!updatedUserGoals) return;

    const a = [updatedUserGoals].map<SalesPlan>(u =>
      goalType === 'amount' ? { ...u, amount: value } : { ...u, quantity: value }
    );

    updateUsersGoals(a);
  };

  const updateTotalGoal = (goalType: GoalType, value: number) => {
    const goalForUser = Math.round(value / usersGoals.length);
    const goalForLastUser = value - goalForUser * (usersGoals.length - 1);

    const changedUsersGoals = usersGoals.map((u, idx) => {
      if (idx === usersGoals.length - 1)
        return goalType === 'amount'
          ? { ...u, amount: goalForLastUser }
          : { ...u, quantity: goalForLastUser };

      return goalType === 'amount'
        ? { ...u, amount: goalForUser }
        : { ...u, quantity: goalForUser };
    });

    updateUsersGoals(changedUsersGoals);
  };

  const changeGroupGoal = (goalType: GoalType, value: number, dId: number, subId?: number) => {
    const department = departments.find(d => d.id === dId);

    if (!department) return;

    const subdepartment = department.subordinates.find(d => d.id === subId);

    const changedUsersGroup = usersGoalsWithUser.filter(u =>
      subdepartment
        ? subdepartment.id === u.user.departmentId
        : department.subordinates.some(
            sub => sub.id === u.user.departmentId || u.user.departmentId === dId
          )
    );

    const goalForUser = Math.round(value / changedUsersGroup.length);
    const goalForLastUser = value - goalForUser * (changedUsersGroup.length - 1);

    const changedUsersGoals = changedUsersGroup.map((u, idx) => {
      if (idx === changedUsersGroup.length - 1)
        return goalType === 'amount'
          ? { ...u, amount: goalForLastUser }
          : { ...u, quantity: goalForLastUser };

      return goalType === 'amount'
        ? { ...u, amount: goalForUser }
        : { ...u, quantity: goalForUser };
    });

    updateUsersGoals(changedUsersGoals);
  };

  const isCandidatesChart = chartType === ChartType.CANDIDATES;

  return (
    <Root>
      {usersGoals.length ? (
        <>
          <HeaderWrapper>
            <Header>
              {!isCandidatesChart && <HeaderItem>{t('form_header_amount')}</HeaderItem>}

              <HeaderItem>{t('form_header_quantity')}</HeaderItem>
            </Header>

            <GoalSettingsFormItem
              groupType="total"
              amount={totalAmount}
              quantity={totalQuantity}
              groupName={t('total')}
              showAmount={!isCandidatesChart}
              onAmountChange={v => updateTotalGoal('amount', v)}
              onQuantityChange={v => updateTotalGoal('quantity', v)}
            />
          </HeaderWrapper>

          {usersWithoutDepartmentOptions.length > 0 && (
            <DepartmentGroup>
              <SubGroup>
                {usersWithoutDepartmentOptions.map(o => (
                  <GoalSettingsFormItem
                    key={o.userId}
                    amount={o.amount}
                    quantity={o.quantity}
                    userFullname={o.fullName}
                    showAmount={!isCandidatesChart}
                    onAmountChange={v => updateUserGoals(o.userId, 'amount', v)}
                    onQuantityChange={v => updateUserGoals(o.userId, 'quantity', v)}
                  />
                ))}
              </SubGroup>
            </DepartmentGroup>
          )}

          {options.map(o => {
            if (!showThisDepartment(o)) return null;

            return (
              <DepartmentGroup key={o.department.id}>
                <DepartmentRawWrapper>
                  <GoalSettingsFormItem
                    groupType="department"
                    amount={o.department.amount}
                    groupName={o.department.name}
                    quantity={o.department.quantity}
                    showAmount={!isCandidatesChart}
                    onAmountChange={(value: number) =>
                      changeGroupGoal('amount', value, o.department.id)
                    }
                    onQuantityChange={(value: number) =>
                      changeGroupGoal('quantity', value, o.department.id)
                    }
                  />
                </DepartmentRawWrapper>

                {o.department.options.length > 0 && (
                  <SubGroup>
                    {o.department.options.map(o => (
                      <GoalSettingsFormItem
                        key={o.userId}
                        amount={o.amount}
                        quantity={o.quantity}
                        userFullname={o.fullName}
                        showAmount={!isCandidatesChart}
                        onAmountChange={value => updateUserGoals(o.userId, 'amount', value)}
                        onQuantityChange={value => updateUserGoals(o.userId, 'quantity', value)}
                      />
                    ))}
                  </SubGroup>
                )}

                {o.subdepartments.map(sub => {
                  if (!showThisSubdepartment(sub)) return null;

                  return (
                    <SubGroup key={sub.id}>
                      <GoalSettingsFormItem
                        groupName={sub.name}
                        groupType="subdepartment"
                        amount={sub.amount}
                        quantity={sub.quantity}
                        showAmount={!isCandidatesChart}
                        onAmountChange={value =>
                          changeGroupGoal('amount', value, o.department.id, sub.id)
                        }
                        onQuantityChange={value =>
                          changeGroupGoal('quantity', value, o.department.id, sub.id)
                        }
                      />

                      {sub.options.map(o => (
                        <GoalSettingsFormItem
                          key={o.userId}
                          userFullname={o.fullName}
                          amount={o.amount}
                          quantity={o.quantity}
                          showAmount={!isCandidatesChart}
                          onAmountChange={value => updateUserGoals(o.userId, 'amount', value)}
                          onQuantityChange={value => updateUserGoals(o.userId, 'quantity', value)}
                        />
                      ))}
                    </SubGroup>
                  );
                })}
              </DepartmentGroup>
            );
          })}
        </>
      ) : null}
    </Root>
  );
});

GoalSettingsForm.displayName = 'GoalSettingsForm';
export { GoalSettingsForm };
