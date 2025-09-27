import { WarningIcon } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  min-height: 180px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;

  text-align: center;

  padding: 16px;
  border: 1px solid var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
`;

const Content = styled.div`
  max-width: 336px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  margin: 0 auto;
`;

const HintTitle = styled.h4<{ $danger: boolean }>`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${p =>
    p.$danger ? 'var(--button-text-red-default)' : 'var(--button-text-graphite-priory-text)'};
  transition: var(--transition-200);
`;

const HintAnnotation = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 19px;
  color: var(--button-text-graphite-secondary-text);
`;

const WarningIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

interface Props {
  title: string;
  annotation: string;
  titleDanger?: boolean;
  children?: ReactNode;
}

const CreateDocumentsHint = (props: Props) => {
  const { title, annotation, titleDanger = false, children } = props;

  return (
    <Root>
      <Content>
        <TitleWrapper>
          {titleDanger && (
            <WarningIconWrapper>
              <WarningIcon />
            </WarningIconWrapper>
          )}

          <HintTitle $danger={titleDanger}>{title}</HintTitle>
        </TitleWrapper>
        <HintAnnotation>{annotation}</HintAnnotation>
      </Content>

      {children}
    </Root>
  );
};

export { CreateDocumentsHint };
