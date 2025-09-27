import { Hint } from '@/shared';
import type { CSSProperties, ReactNode, Ref } from 'react';
import styled, { css } from 'styled-components';

interface RootProps {
  $disabled?: boolean;
  $drawerView?: boolean;
}

const Root = styled.section<RootProps>`
  display: flex;
  flex-direction: column;

  ${p =>
    !p.$drawerView &&
    css`
      border: 1px solid var(--graphite-graphite-80);
      border-radius: var(--border-radius-block);
    `}

  ${p =>
    p.$disabled &&
    css`
      opacity: 0.65;

      pointer-events: none;
    `}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 12px 16px;
  border-bottom: 1px solid var(--graphite-graphite-80);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 16px;
`;

interface Props {
  ref?: Ref<HTMLDivElement>;
  headerTitle: ReactNode;
  children: ReactNode;
  hint?: string;
  disabled?: boolean;
  styles?: CSSProperties;
  openedFromCard?: boolean;
}

const AppointmentBlock = (props: Props) => {
  const { ref, headerTitle, children, hint, styles, openedFromCard: drawerView, disabled } = props;

  return (
    <Root ref={ref} $drawerView={drawerView} $disabled={disabled} style={{ ...styles }}>
      {!drawerView && (
        <Header>
          {headerTitle}

          {hint && <Hint text={hint} />}
        </Header>
      )}

      <Body>{children}</Body>
    </Root>
  );
};

export { AppointmentBlock };
