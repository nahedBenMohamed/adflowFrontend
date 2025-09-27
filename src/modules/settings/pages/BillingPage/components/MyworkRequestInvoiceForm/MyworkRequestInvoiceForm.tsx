import { formApi, generalSettingsStore, SiteFormDataDto, SiteFormFieldDataDto } from '@/app';
import { authStore } from '@/modules/auth';
import {
  envUtil,
  HeadlessFormItem,
  InputModel,
  MyInput,
  MyInputNumber,
  MySelect,
  type Nullable,
  NumberModel,
  type Option,
  PrimaryButton,
  SelectModel,
  validateForm,
} from '@/shared';
import { FocusTrap } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { type CurrentDiscount, type LifetimeDealPricingPlan } from '../../../../shared';
import { MyworkInvoicePdf } from './components';

const Root = styled.div`
  max-width: 560px;

  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 16px;

  padding: 24px 32px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);

  box-shadow:
    0px 1px 2px 0px #d0daeb,
    0px 0px 2px 0px #eef4fe;
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--primary-statuses-red-360);
`;

const SuccessMessage = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-green-active);
`;

const StyledPdfDownloadLink = styled(PDFDownloadLink)<{ $disabled: boolean }>`
  width: fit-content;

  ${p => p.$disabled && `pointer-events: none`};
`;

interface InitialForm {
  numberOfUsers: SelectModel;
  numberOfUsersUnlimited: NumberModel;
  period: SelectModel;
  plan: SelectModel;
  name: InputModel;
  itn: InputModel;
  address: InputModel;
}

interface Props {
  plan: LifetimeDealPricingPlan;
  plans: LifetimeDealPricingPlan[];
  discount: Nullable<CurrentDiscount>;
  planKey: keyof LifetimeDealPricingPlan;
}

const MyworkRequestInvoiceForm = observer((props: Props) => {
  const { discount, plan, plans, planKey } = props;

  const { account } = generalSettingsStore;
  const { user: currentUser } = authStore;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<Nullable<string>>(null);
  const [isSuccessMessageShown, { open: showSuccessMessage, close: hideSuccessMessage }] =
    useDisclosure(false);

  const businessPlanOptionId = -1;
  const advancedPlanOptionId = -2;

  const lifetimePeriodOptionId = -3;
  const yearPeriodOptionId = -4;
  const monthPeriodOptionId = -5;

  const initialPlanValue = useMemo<number>(() => {
    switch (planKey) {
      case 'ltd_business_old_price':
      case 'business_year':
      case 'business_month':
        return businessPlanOptionId;

      case 'ltd_advanced_old_price':
      case 'advanced_year':
      case 'advanced_month':
        return advancedPlanOptionId;

      default:
        throw new Error(`Failed to set initial plan value: ${planKey}`);
    }
  }, [planKey, advancedPlanOptionId, businessPlanOptionId]);

  const initialPeriodValue = useMemo<number>(() => {
    switch (planKey) {
      case 'ltd_business_old_price':
      case 'ltd_advanced_old_price':
        return lifetimePeriodOptionId;

      case 'business_year':
      case 'advanced_year':
        return yearPeriodOptionId;

      case 'business_month':
      case 'advanced_month':
        return monthPeriodOptionId;

      default:
        throw new Error(`Failed to set initial period value: ${planKey}`);
    }
  }, [planKey, lifetimePeriodOptionId, yearPeriodOptionId, monthPeriodOptionId]);

  const form = useLocalObservable<InitialForm>(() => ({
    numberOfUsers: SelectModel.create(plan.users),
    numberOfUsersUnlimited: NumberModel.create(plan.users),
    period: SelectModel.create(initialPeriodValue).required(),
    plan: SelectModel.create(initialPlanValue).required(),
    name: InputModel.create().required(),
    itn: InputModel.create().required(),
    address: InputModel.create().required(),
  }));

  const numberOfUsersOptions = useMemo<Option<number>[]>(() => {
    const options = plans.map(p => ({
      value: p.users,
      label: String(p.users),
    }));

    // business plan is not available for some users count options
    if (form.plan.value === businessPlanOptionId)
      return options.filter(
        o => plans.find(p => p.users === o.value)?.ltd_business_old_price !== null
      );

    return options;
  }, [businessPlanOptionId, form.plan.value, plans]);

  const numberOfUsers = useMemo<number>(
    () =>
      form.period.value === monthPeriodOptionId
        ? form.numberOfUsersUnlimited.valueOrZero
        : form.numberOfUsers.value,
    [
      form.numberOfUsers.value,
      form.numberOfUsersUnlimited.valueOrZero,
      form.period.value,
      monthPeriodOptionId,
    ]
  );

  useEffect(() => {
    form.numberOfUsersUnlimited.setValue(form.numberOfUsers.value);
  }, [form.numberOfUsers.value, form.numberOfUsersUnlimited]);

  const planOptions = useMemo<Option<number>[]>(
    () => [
      {
        value: businessPlanOptionId,
        label: 'Бизнес',
      },
      {
        value: advancedPlanOptionId,
        label: 'Продвинутый',
      },
    ],
    [advancedPlanOptionId, businessPlanOptionId]
  );

  const periodOptions = useMemo<Option<number>[]>(
    () => [
      {
        value: lifetimePeriodOptionId,
        label: 'Бессрочно',
      },
      {
        value: yearPeriodOptionId,
        label: '1 год',
      },
      {
        value: monthPeriodOptionId,
        label: '1 месяц (минимальный срок – 6 месяцев)',
      },
    ],
    [lifetimePeriodOptionId, monthPeriodOptionId, yearPeriodOptionId]
  );

  const planReadableName = useMemo<string>(() => {
    const result = planOptions.find(o => o.value === form.plan.value)?.label;

    if (!result) throw new Error(`Failed to identify readable plan name: ${form.plan.value}`);

    return result;
  }, [form.plan.value, planOptions]);

  const periodReadableName = useMemo<string>(() => {
    switch (form.period.value) {
      case lifetimePeriodOptionId:
        return 'пожизненную';

      case yearPeriodOptionId:
        return 'годовую';

      case monthPeriodOptionId:
        return 'ежемесячную';

      default:
        throw new Error(`Failed to identify readable period name: ${form.period.value}`);
    }
  }, [form.period.value, lifetimePeriodOptionId, yearPeriodOptionId, monthPeriodOptionId]);

  const periodAdditionalString = useMemo<string>(
    () => (form.period.value === monthPeriodOptionId ? ' на 6 месяцев' : ''),
    [form.period.value, monthPeriodOptionId]
  );

  const priceKey = useMemo<keyof LifetimeDealPricingPlan>(() => {
    if (form.plan.value === businessPlanOptionId) {
      switch (form.period.value) {
        case lifetimePeriodOptionId:
          return 'ltd_business_old_price';

        case yearPeriodOptionId:
          return 'business_year';

        case monthPeriodOptionId:
          return 'business_month';
      }
    } else {
      switch (form.period.value) {
        case lifetimePeriodOptionId:
          return 'ltd_advanced_old_price';

        case yearPeriodOptionId:
          return 'advanced_year';

        case monthPeriodOptionId:
          return 'advanced_month';
      }
    }

    throw new Error(
      `Failed to identify price key for these parameters: ${form.plan.value}, ${form.period.value}`
    );
  }, [
    businessPlanOptionId,
    form.period.value,
    form.plan.value,
    lifetimePeriodOptionId,
    monthPeriodOptionId,
    yearPeriodOptionId,
  ]);

  const planOption = useMemo<number>(() => {
    if (form.plan.value === businessPlanOptionId) {
      switch (form.period.value) {
        case lifetimePeriodOptionId:
          return envUtil.requestMyworkInvoiceWorkspaceFormPlanLtdBusinessId;

        case yearPeriodOptionId:
          return envUtil.requestMyworkInvoiceWorkspaceFormPlanYearBusinessId;

        case monthPeriodOptionId:
          return envUtil.requestMyworkInvoiceWorkspaceFormPlanMonthBusinessId;
      }
    } else {
      switch (form.period.value) {
        case lifetimePeriodOptionId:
          return envUtil.requestMyworkInvoiceWorkspaceFormPlanLtdAdvancedId;

        case yearPeriodOptionId:
          return envUtil.requestMyworkInvoiceWorkspaceFormPlanYearAdvancedId;

        case monthPeriodOptionId:
          return envUtil.requestMyworkInvoiceWorkspaceFormPlanMonthAdvancedId;
      }
    }

    throw new Error(
      `Failed to identify price key for these parameters: ${form.plan.value}, ${form.period.value}`
    );
  }, [
    businessPlanOptionId,
    form.period.value,
    form.plan.value,
    lifetimePeriodOptionId,
    monthPeriodOptionId,
    yearPeriodOptionId,
  ]);

  const totalAmount = useMemo<number>(() => {
    // monthly subscription – 499 ₽ or 999 ₽ per user for 6 months based on plan
    if (form.period.value === monthPeriodOptionId) {
      if (form.plan.value === businessPlanOptionId) {
        return 499 * form.numberOfUsersUnlimited.valueOrZero * 6;
      } else {
        return 999 * form.numberOfUsersUnlimited.valueOrZero * 6;
      }
    }

    const plan = plans.find(p => p.users === form.numberOfUsers.value);

    if (!plan)
      throw new Error(`Failed to find plan for number of users: ${form.numberOfUsers.value}`);

    let price = plan[priceKey];

    if (!price)
      throw new Error(
        `Undefined price for priceKey ${priceKey} and number of users ${form.numberOfUsers.value}`
      );

    if (priceKey.includes('ltd') && discount) price = price * (1 - discount.percent / 100);

    return price;
  }, [
    businessPlanOptionId,
    form.numberOfUsers.value,
    form.numberOfUsersUnlimited.valueOrZero,
    form.period.value,
    form.plan.value,
    monthPeriodOptionId,
    discount,
    plans,
    priceKey,
  ]);

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm(form)) return;

    setErrorMessage(null);
    hideSuccessMessage();

    try {
      setIsSubmitting(true);

      const dto = new SiteFormDataDto({
        fields: [
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormNumberOfUsersFieldId,
            value: numberOfUsers,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormPlanFieldId,
            value: planOption,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormNameFieldId,
            value: form.name.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormItnFieldId,
            value: form.itn.trimmedValue,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormAddressFieldId,
            value: form.address.trimmedValue,
          }),

          // hidden fields (contain useful account information)
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormContactNameFieldId,
            value: currentUser?.fullName,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormPhoneFieldId,
            value: currentUser?.phone,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormEmailFieldId,
            value: currentUser?.email,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormSubdomainFieldId,
            value: account?.subdomain,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormInvoiceIdFieldId,
            value: account?.id,
          }),
          new SiteFormFieldDataDto({
            id: envUtil.requestMyworkInvoiceWorkspaceFormTotalPriceFieldId,
            value: totalAmount,
          }),
        ],
      });

      const { result, message } = await formApi.sendMyworkInvoiceForm(dto);

      if (result) {
        showSuccessMessage();
      } else {
        message ? setErrorMessage(message) : setErrorMessage('Произошла ошибка. Попробуйте позже.');

        return;
      }
    } catch (e) {
      setErrorMessage('Произошла ошибка. Попробуйте позже.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Root>
      <FocusTrap>
        <HeadlessFormItem text={'Тариф *'}>
          <MySelect model={form.plan} options={planOptions} variant="outlined" />
        </HeadlessFormItem>

        <HeadlessFormItem text={'Период подписки *'}>
          <MySelect model={form.period} options={periodOptions} variant="outlined" />
        </HeadlessFormItem>

        <HeadlessFormItem text={'Количество пользователей *'}>
          {form.period.value === monthPeriodOptionId ? (
            <MyInputNumber
              min={1}
              max={1000}
              variant="outlined"
              model={form.numberOfUsersUnlimited}
            />
          ) : (
            <MySelect
              searchBar={false}
              variant="outlined"
              model={form.numberOfUsers}
              options={numberOfUsersOptions}
            />
          )}
        </HeadlessFormItem>

        <HeadlessFormItem text={'Наименование организации *'}>
          <MyInput model={form.name} variant="outlined" placeholder="ООО «Мое пространство»" />
        </HeadlessFormItem>

        <HeadlessFormItem text={'ИНН *'}>
          <MyInput model={form.itn} variant="outlined" placeholder="Введите ИНН (10 цифр)" />
        </HeadlessFormItem>

        <HeadlessFormItem text={'Юридический адрес *'}>
          <MyInput
            model={form.address}
            variant="outlined"
            placeholder="Введите юридический адрес"
          />
        </HeadlessFormItem>

        {account && (
          <StyledPdfDownloadLink
            $disabled={isSubmitting}
            fileName="Счёт_за_подписку_Mywork.pdf"
            document={
              <MyworkInvoicePdf
                amount={totalAmount}
                accountId={account.id}
                plan={planReadableName}
                period={periodReadableName}
                customerItn={form.itn.trimmedValue}
                customerName={form.name.trimmedValue}
                periodAdditional={periodAdditionalString}
                customerAddress={form.address.trimmedValue}
                numberOfUsers={numberOfUsers}
              />
            }
            onClick={handleSubmit}
          >
            <PrimaryButton loading={isSubmitting}>{'Сгенерировать счет'}</PrimaryButton>
          </StyledPdfDownloadLink>
        )}

        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        {isSuccessMessageShown && (
          <SuccessMessage>
            {'Спасибо за использование Mywork! Ваша подписка будет активирована после оплаты.'}
          </SuccessMessage>
        )}
      </FocusTrap>
    </Root>
  );
});

export { MyworkRequestInvoiceForm };
