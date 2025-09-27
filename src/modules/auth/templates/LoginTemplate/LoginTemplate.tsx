import { envUtil } from '@/shared';
import { MediaBreakpoints } from '@/shared/lib/models/MediaBreakpoints';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  width: 100%;
  height: 100dvh;

  display: grid;
  grid-template-columns: 1fr 560px;

  background-color: var(--background-green-20);

  @media ${MediaBreakpoints.SM} {
    height: 100%;
    min-height: 100dvh;

    display: flex;

    padding: 16px;
  }
`;

const LeftBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: 80px;

  padding: 80px;
  overflow: hidden;

  @media ${MediaBreakpoints.SM} {
    display: none;
  }
`;

const RightBlock = styled.section`
  width: 100%;
  height: 100%;

  overflow-y: auto;
  padding: 40px 64px 24px;
  background: var(--primary-statuses-white-0);
  border-left: 1px solid var(--graphite-graphite-80);

  @media ${MediaBreakpoints.SM} {
    min-height: 100dvh;

    display: flex;
    align-items: center;

    overflow-y: auto;
    border-radius: 16px;
    box-shadow: var(--shadow-3);
    padding: 16px 24px 48px 16px;
    border: 1px solid var(--graphite-graphite-40);
  }
`;

const TitleWrapper = styled.div`
  max-width: 596px;

  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  font-size: 38px;
  font-weight: 600;
  line-height: 48px;
  white-space: pre-wrap;
  font-family: Geologica;
  color: var(--graphite-graphite-840);
`;

const Annotation = styled.p`
  font-size: 24px;
  line-height: 43px;
  font-family: Nunito;
  color: var(--graphite-graphite-840);
`;

const Image = styled.img`
  overflow: hidden;

  width: 100%;
  max-width: 640px;
  height: auto;

  object-fit: contain;
  object-position: left;
`;

interface Props {
  children: ReactNode;
}

const LoginTemplate = (props: Props) => {
  const { children } = props;

  const { i18n, t } = useTranslation('page.login', {
    keyPrefix: 'login.left_block',
  });

  return (
    <Root>
      <LeftBlock>
        <TitleWrapper>
          <Title>{t('title', { company: envUtil.appName })}</Title>
          <Annotation>{t('annotation')}</Annotation>
        </TitleWrapper>

        <Image
          src={`/images/login/${i18n.language === 'ru' ? 'ru' : 'en'}/login.png`}
          alt={t('image_alt', { company: envUtil.appName })}
        />
      </LeftBlock>
      <RightBlock>{children}</RightBlock>
    </Root>
  );
};

export { LoginTemplate };
