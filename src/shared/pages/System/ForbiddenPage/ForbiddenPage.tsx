import { routes } from '@/app';
import { HttpStatusCode } from 'axios';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LogoLink, PrimaryButton, envUtil } from '../../../lib';
import { ErrorCodeTitle, SystemPageContent, SystemPageRoot } from '../components';

const ButtonsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ForbiddenPage = () => {
  const { t } = useTranslation('page.system', {
    keyPrefix: 'forbidden_page',
  });

  const navigate = useNavigate();

  const hasPreviousLocationInHistory = window.history.length > 1;

  return (
    <SystemPageRoot>
      <LogoLink href={envUtil.appUrl} />

      <SystemPageContent>
        <ErrorCodeTitle code={HttpStatusCode.Forbidden}>{t('title')}</ErrorCodeTitle>

        <ButtonsWrapper>
          <PrimaryButton
            variant="empty"
            onClick={
              hasPreviousLocationInHistory ? () => navigate(-1) : () => navigate(routes.root)
            }
          >
            {t('back')}
          </PrimaryButton>

          <PrimaryButton variant="link" linkProps={{ to: routes.root }}>
            {t('home')}
          </PrimaryButton>
        </ButtonsWrapper>
      </SystemPageContent>
    </SystemPageRoot>
  );
};

export { ForbiddenPage };
