import { SettingsPageTitle } from '@/modules/settings';
import { PlusPrimaryIcon, PrimaryButton } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Annotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
`;

interface Props {
  openAddModal: () => void;
}

const CallsSipRegistrationsPageTitle = memo((props: Props) => {
  const { openAddModal } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_sip_registrations_page',
  });

  return (
    <Root>
      <TitleWrapper>
        <SettingsPageTitle>{t('title')}</SettingsPageTitle>

        <PrimaryButton iconProps={{ Icon: <PlusPrimaryIcon /> }} onClick={openAddModal}>
          {t('add_sip_registration')}
        </PrimaryButton>
      </TitleWrapper>

      <Annotation>{t('title_annotation')}</Annotation>
    </Root>
  );
});

CallsSipRegistrationsPageTitle.displayName = 'CallsSipRegistrationsPageTitle';
export { CallsSipRegistrationsPageTitle };
