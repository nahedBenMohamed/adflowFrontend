/* eslint-disable i18next/no-literal-string */

import { Collapse } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CaretIcon } from '../../../assets';
import { PrimaryButton } from '../../../lib';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 48px;
`;

const Title = styled.h1`
  font-size: 32px;
  line-height: 46px;
  color: var(--button-text-graphite-priory-text);
`;

const Annotation = styled.p`
  max-width: 800px;

  font-size: 16px;
  line-height: 22px;
  color: var(--button-text-graphite-priory-text);
`;

const ErrorMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArrowIconWrapper = styled.div<{ active: boolean }>`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);
  transform: ${p => (p.active ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const ShowErrorMessageTitle = styled.button`
  width: fit-content;

  display: flex;
  align-items: center;
  gap: 2px;

  font-size: 16px;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    color: var(--button-text-blue-hover);

    svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    color: var(--button-text-blue-active);

    svg path {
      fill: var(--button-text-blue-active);
    }
  }
`;

const ErrorMessageBlock = styled.div`
  max-width: 700px;
  max-height: 500px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  font-family: var(--font-family-mono);

  padding: 16px;
  margin-top: 16px;
  overflow-y: auto;
  border: 1px solid var(--graphite-graphite-80);
  background-color: var(--graphite-graphite-20);
  border-radius: var(--border-radius-element);
`;

const ErrorTitle = styled.div`
  font-weight: 600;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

interface Props {
  error: Error;
}

const ErrorPage = (props: Props) => {
  const { error } = props;

  const { t } = useTranslation('page.system', {
    keyPrefix: 'error_page',
  });

  const [errorMessageShown, { toggle: toggleErrorMessageShown }] = useDisclosure(false);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Root>
      <Title>{t('title')}</Title>
      <Annotation>{t('annotation')}</Annotation>

      <ErrorMessageWrapper>
        <ShowErrorMessageTitle onClick={toggleErrorMessageShown}>
          <ArrowIconWrapper active={errorMessageShown}>
            <CaretIcon />
          </ArrowIconWrapper>

          {t('show_error')}
        </ShowErrorMessageTitle>

        <Collapse in={errorMessageShown}>
          <ErrorMessageBlock>
            <ErrorTitle>Error: {error.name}</ErrorTitle>
            {error.message}

            <ErrorTitle>Call stack:</ErrorTitle>
            {error.stack}
          </ErrorMessageBlock>
        </Collapse>
      </ErrorMessageWrapper>

      <Controls>
        <PrimaryButton onClick={handleGoHome}>{t('home')}</PrimaryButton>

        <PrimaryButton variant="outlined" onClick={handleReload}>
          {t('reload')}
        </PrimaryButton>
      </Controls>
    </Root>
  );
};

export { ErrorPage };
