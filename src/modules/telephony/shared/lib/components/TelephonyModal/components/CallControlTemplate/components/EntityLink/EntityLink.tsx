import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import { memo } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { EntityLinkIcon } from '../../../../../../../assets';

interface RootProps {
  $variant: EntityLinkVariant;
  $disabled?: boolean;
}

const Root = styled(Link)<RootProps>`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  color: var(--primary-blue);
  font-weight: ${p => (p.$variant === 'small' ? 500 : 600)};
  font-size: ${p => (p.$variant === 'small' ? '16px' : '22px')};
  line-height: ${p => (p.$variant === 'small' ? '24px' : '26px')};
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
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

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      color: var(--button-text-graphite-secondary-text);
    `}

  ${TruncateMixin}
`;

const IconWrapper = styled.div`
  height: 20px;
  width: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

type EntityLinkVariant = 'small' | 'large';

interface Props extends LinkProps {
  entityName: string;
  disabled?: boolean;
  variant?: EntityLinkVariant;
}

const EntityLink = memo((props: Props) => {
  const { entityName, disabled, variant = 'large', ...rest } = props;

  return (
    <Root $disabled={disabled} $variant={variant} {...rest}>
      <SpanWithEllipsis text={entityName} />

      {!disabled && (
        <IconWrapper>
          <EntityLinkIcon />
        </IconWrapper>
      )}
    </Root>
  );
});

EntityLink.displayName = 'EntityLink';
export { EntityLink };
