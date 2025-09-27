import { appStore, routes, subscriptionStore } from '@/app';
import { authStore } from '@/modules/auth';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { TimeManagementIcon } from '../../../../../assets';
import { UtcDate } from '../../../../models';
import type { Nullable } from '../../../../types';
import { envUtil } from '../../../../utils';
import { DialogModalPrimary } from '../../Dialog/DialogModalPrimary/DialogModalPrimary';

const Root = styled.div<{ $noTopPadding: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: ${p => (p.$noTopPadding ? '0 32px 24px' : '16px 32px 24px')};
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  padding: 0 32px;
`;

const IconWrapper = styled.div`
  width: 240px;
  height: 240px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Subtitle = styled.p`
  width: 336px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  isOpened: boolean;
  onClose: () => void;
}

const SubscriptionPeriodOverModal = observer((props: Props) => {
  const { isOpened, onClose } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'subscription_period_modal',
  });

  const navigate = useNavigate();

  if (!appStore.isLoaded) return null;

  const isAdmin = authStore.isAdmin();
  const subscription = subscriptionStore.subscription;

  const isTrial = subscription?.isTrial;
  const isValid = subscription?.isValid;
  const expiredAt = subscription?.expiredAt;
  const isExternal = subscription?.isExternal;

  const getFormMessages = (): {
    title: string;
    daysLeft: number;
    subtitle: Nullable<string>;
  } => {
    const daysLeft = expiredAt ? Math.ceil(expiredAt.diffDays(UtcDate.now())) : 0;

    if (isTrial) {
      const subtitle = t('trial_sub_title', { company: envUtil.appName });

      const title =
        !isValid || daysLeft <= 0 ? t('trial_over') : t('trial_left', { left: daysLeft });

      return { title, daysLeft, subtitle };
    }

    if (!isValid || daysLeft <= 0)
      return {
        daysLeft,
        title: t('subscription_over'),
        subtitle: t('subscription_sub_title', { company: envUtil.appName }),
      };

    return { title: t('subscription_left', { left: daysLeft }), daysLeft, subtitle: null };
  };

  const { title, daysLeft, subtitle } = getFormMessages();

  const handleApprove = () => {
    navigate(
      isExternal || isTrial ? routes.settingsBillingStripe() : routes.settingsBillingCommon()
    );

    onClose();
  };

  const isTrialOver = !isValid || daysLeft === 0;

  return (
    <DialogModalPrimary
      hideCancel
      width="400px"
      maxHeight="100%"
      isOpened={isOpened}
      height="fit-content"
      hideControls={!isAdmin}
      hideCloseCross={isTrialOver}
      approveTitle={t('select_plan')}
      onClose={onClose}
      onApprove={handleApprove}
    >
      <Root $noTopPadding={isTrialOver}>
        <Title>{title}</Title>

        <IconWrapper>
          <TimeManagementIcon />
        </IconWrapper>

        {isAdmin ? (
          subtitle && <Subtitle>{subtitle}</Subtitle>
        ) : (
          <Subtitle>{t('contact_admin')}</Subtitle>
        )}
      </Root>
    </DialogModalPrimary>
  );
});

SubscriptionPeriodOverModal.displayName = 'SubscriptionPeriodOverModal';
export { SubscriptionPeriodOverModal };
