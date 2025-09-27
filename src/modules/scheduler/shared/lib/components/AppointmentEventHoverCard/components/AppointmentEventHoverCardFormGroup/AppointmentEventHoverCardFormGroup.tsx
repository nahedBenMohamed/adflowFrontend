import { TruncateMixin } from '@/shared';
import type { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

interface RootProps {
  $gray?: boolean;
  $alignItems?: CSSProperties['alignItems'];
}

const Root = styled.div<RootProps>`
  max-width: 100%;

  display: grid;
  column-gap: 8px;
  grid-template-columns: 40% 1fr;
  align-items: ${p => p.$alignItems ?? 'center'};

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p =>
    p.$gray
      ? 'var(--button-text-graphite-secondary-text)'
      : 'var(--button-text-graphite-priory-text)'};

  ${TruncateMixin}
`;

const Label = styled.p`
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

interface Props {
  label: string;
  children: ReactNode;
  gray?: boolean;
  alignItems?: CSSProperties['alignItems'];
}

const AppointmentEventHoverCardFormGroup = (props: Props) => {
  const { label, children, gray, alignItems } = props;

  return (
    <Root $alignItems={alignItems} $gray={gray}>
      <Label>{label}</Label>

      {children}
    </Root>
  );
};

export { AppointmentEventHoverCardFormGroup };
