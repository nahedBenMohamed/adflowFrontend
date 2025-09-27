import { Hint, MyRadio, type MyRadioProps } from '@/shared';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';

const Root = styled.div`
  width: 100%;

  display: flex;
  gap: 8px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const RadioWrapper = styled.div`
  height: 20px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const RadioContentWrapper = styled.div<{ $outlined?: boolean }>`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: ${p => (p.$outlined ? '8px' : '16px')};
`;

const RadioContent = styled(RadioContentWrapper)`
  gap: 16px;

  ${p =>
    p.$outlined &&
    css`
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid var(--graphite-graphite-80);
    `}
`;

interface Props {
  radioProps: MyRadioProps;
  title: string;
  hint?: string;
  children?: ReactNode;
  contentOutlined?: boolean;
}

const RadioBlockWrapper = (props: Props) => {
  const { radioProps, title, children, hint, contentOutlined } = props;

  return (
    <Root>
      <RadioWrapper>
        <MyRadio {...radioProps} />
      </RadioWrapper>

      <RadioContentWrapper $outlined={contentOutlined}>
        <Title>
          {title}

          {hint && <Hint text={hint} />}
        </Title>

        {children && <RadioContent $outlined={contentOutlined}>{children}</RadioContent>}
      </RadioContentWrapper>
    </Root>
  );
};

export { RadioBlockWrapper };
