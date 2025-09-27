import { appStore, subscriptionStore } from '@/app';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { calculateEndOfWordIdxByNumber } from '../../../../helpers';
import { UtcDate } from '../../../../models';
import { SubscriptionPeriodOverModal } from '../../../Modals/UtilityModals/SubscriptionPeriodOverModal/SubscriptionPeriodOverModal';

const Tag = styled.button`
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--primary-statuses-orange-440);

  padding: 4px 8px;
  white-space: nowrap;
  border: 1px solid var(--neutral-orange-80);
  background-color: var(--neutral-orange-80);
  border-radius: var(--border-radius-block);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    border-color: var(--primary-statuses-orange-440);
  }

  &:active {
    color: var(--secondary-orange-240);

    border-color: var(--background-orange-20);
    background-color: var(--background-orange-20);
  }
`;

const TrialButton = observer(() => {
  const [isModalOpened, { close: hideModal, open: showModal }] = useDisclosure(false);

  const { t } = useTranslation();

  const { isTrial, isValid, subscription } = subscriptionStore;

  const isPaid = !isTrial && isValid;

  const daysLeft = useMemo<number>(
    () => (subscription?.expiredAt ? Math.ceil(subscription.expiredAt.diffDays(UtcDate.now())) : 0),
    [subscription]
  );

  const getTagText = useMemo<string>(() => {
    if (daysLeft === 1) return t('trial_left.one_day');

    const idx = calculateEndOfWordIdxByNumber(daysLeft);

    return t(`trial_left.several_days.${idx}`, { left: daysLeft });
  }, [daysLeft, t]);

  if (!appStore.isLoaded || isPaid) return null;

  return (
    <>
      <Tag onClick={showModal}>{getTagText}</Tag>

      <SubscriptionPeriodOverModal isOpened={isModalOpened} onClose={hideModal} />
    </>
  );
});

TrialButton.displayName = 'TrialButton';
export { TrialButton };
