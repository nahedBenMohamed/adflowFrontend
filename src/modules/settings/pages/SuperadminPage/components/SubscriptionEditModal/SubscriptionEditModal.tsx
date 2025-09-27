import { UpdateSubscriptionDto, useUpdateSubscription } from '@/app';
import { Account } from '@/modules/settings';
import {
  BooleanModel,
  DialogModalSecondary,
  InputModel,
  MyCheckboxWithBooleanModel,
  MyDatePickerSelect,
  MyInput,
  MyInputNumber,
  NumberModel,
  SelectModel,
  Subscription,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: grid;
  flex-direction: column;
  gap: 16px;

  padding: 16px 24px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemWrapper = styled.label`
  display: grid;
  grid-template-columns: 1fr 2fr;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface InitialForm {
  planName: InputModel;
  usersLimit: NumberModel;
  isTrial: BooleanModel;
  expiredAt: SelectModel;
}

interface Props {
  isOpened: boolean;
  account: Account;
  subscription: Subscription;
  onClose: () => void;
}

const SubscriptionEditModal = observer((props: Props) => {
  const { isOpened, account, subscription, onClose } = props;

  const [isOpenedDropdown, { open, close }] = useDisclosure(false);

  const form = useLocalObservable<InitialForm>(() => ({
    planName: InputModel.create(subscription.planName),
    usersLimit: NumberModel.create(subscription.userLimit),
    isTrial: BooleanModel.create(subscription.isTrial),
    expiredAt: SelectModel.create(subscription.expiredAt),
  }));

  const { mutateAsync: updateSubscription, isPending } = useUpdateSubscription(account.id);

  const handleApprove = useCallback(async () => {
    const dto: UpdateSubscriptionDto = {
      planName: form.planName.value,
      userLimit: form.usersLimit.value ?? 1,
      isTrial: form.isTrial.value,
      periodEnd: form.expiredAt ? form.expiredAt.value.formatISO() : null,
    };

    await updateSubscription(dto);

    onClose();
  }, [form, onClose, updateSubscription]);

  return (
    <DialogModalSecondary
      width="100%"
      maxWidth="540px"
      maxHeight="380px"
      approveTitle="Сохранить"
      isOpened={isOpened}
      onClose={onClose}
      loading={isPending}
      approveDisabled={isPending}
      onApprove={handleApprove}
      Header={<HeaderWrapper>{`Настройки подписки аккаунта ${account.companyName}`}</HeaderWrapper>}
    >
      <Root>
        <ItemWrapper>
          {'Название плана'}

          <MyInput variant="outlined" model={form.planName} />
        </ItemWrapper>

        <ItemWrapper>
          {'Лимит пользователей'}

          <MyInputNumber variant="outlined" model={form.usersLimit} min={1} />
        </ItemWrapper>

        <ItemWrapper>
          {'Пробный период?'}

          <MyCheckboxWithBooleanModel model={form.isTrial} />
        </ItemWrapper>

        <ItemWrapper>
          {'Дата окончания подписки'}

          <MyDatePickerSelect
            variant="outlined"
            type="default"
            model={form.expiredAt}
            opened={isOpenedDropdown}
            show={open}
            hide={close}
          />
        </ItemWrapper>
      </Root>
    </DialogModalSecondary>
  );
});

SubscriptionEditModal.displayName = 'SubscriptionEditModal';
export { SubscriptionEditModal };
