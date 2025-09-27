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

const NotFoundPage = () => {
  const { t } = useTranslation('page.system', {
    keyPrefix: 'not_found_page',
  });

  const navigate = useNavigate();

  const hasPreviousLocationInHistory = window.history.length > 1;

  return (
    <SystemPageRoot>
      <LogoLink href={envUtil.appUrl} />

      <SystemPageContent>
        <ErrorCodeTitle code={HttpStatusCode.NotFound}>{t('title')}</ErrorCodeTitle>

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

export { NotFoundPage };

// I was here through multiple MVPs and paradigm shifts. Some code was
// written, and some architecture was developed, though not as well as it could
// have been due to a lack of time and resources.

// If you're reading this and have any questions, feel free to reach out to me! 😎

// https://github.com/kr4chinin (2022-2024)
