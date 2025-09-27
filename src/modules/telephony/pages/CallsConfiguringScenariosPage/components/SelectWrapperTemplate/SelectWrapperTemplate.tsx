import { MyFloatingTooltip } from '@/shared';
import type { ReactNode } from 'react';
import styled, { type CSSProperties } from 'styled-components';

interface RootProps {
  $disabled?: boolean;
  $width?: CSSProperties['width'];
}

const Root = styled.div<RootProps>`
  width: ${p => p.$width};

  display: flex;
  flex-direction: column;
  gap: 8px;

  transition: var(--transition-200);

  ${p => p.$disabled && `opacity: 0.35;`}
`;

const Title = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface SelectWrapperTemplateDisabledProps {
  disabled: boolean;
  warningTitle: string;
}

export interface SelectWrapperTemplateProps {
  title: string;
  children: ReactNode;
  disabledProps?: SelectWrapperTemplateDisabledProps;
  width?: CSSProperties['maxWidth'];
}

const SelectWrapperTemplate = (props: SelectWrapperTemplateProps) => {
  const { title, children, disabledProps, width } = props;

  const disabled = disabledProps?.disabled;

  const Content = (
    <Root $disabled={disabled} $width={width}>
      <Title>{title}</Title>
      {children}
    </Root>
  );

  return disabledProps && disabled ? (
    <MyFloatingTooltip label={disabledProps.warningTitle}>{Content}</MyFloatingTooltip>
  ) : (
    Content
  );
};

export { SelectWrapperTemplate };
