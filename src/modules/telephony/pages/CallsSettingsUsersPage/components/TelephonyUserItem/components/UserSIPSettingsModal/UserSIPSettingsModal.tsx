import { DialogModalSecondary } from '@/shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useGetVoximplantUserSIPSettings } from '../../../../../../api';
import { UserSIPSettingsFormItem } from '../UserSIPSettingsFormItem/UserSIPSettingsFormItem';
import { UserSIPSettingsModalSkeleton } from '../UserSIPSettingsModalSkeleton/UserSIPSettingsModalSkeleton';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;

  padding: 24px 32px;
`;

const Annotation = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

interface Props {
  userId: number;
  opened: boolean;
  userName: string;
  onClose: () => void;
}

const UserSIPSettingsModal = (props: Props) => {
  const { userId, opened, userName, onClose } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_users_page',
  });

  const { data: userSIPSettings, isLoading } = useGetVoximplantUserSIPSettings(userId);

  return (
    <DialogModalSecondary
      hideCancel
      width="100%"
      height="340px"
      maxWidth="564px"
      isOpened={opened}
      approveTitle={t('continue')}
      Header={t('sip_settings_title', { userName })}
      onClose={onClose}
    >
      <Root>
        <Annotation>{t('sensitive_warning')}</Annotation>

        <Delimiter />

        {userSIPSettings && !isLoading ? (
          <>
            <UserSIPSettingsFormItem label={t('user_name')} text={userSIPSettings.userName} />

            <UserSIPSettingsFormItem label={t('domain')} text={userSIPSettings.domain} />

            <UserSIPSettingsFormItem
              isPassword
              label={t('password')}
              text={userSIPSettings.password}
            />
          </>
        ) : (
          <UserSIPSettingsModalSkeleton />
        )}
      </Root>
    </DialogModalSecondary>
  );
};

export { UserSIPSettingsModal };
