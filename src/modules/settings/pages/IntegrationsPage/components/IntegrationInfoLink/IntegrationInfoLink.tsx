import { LinkIcon } from '@/shared';
import { Link, type LinkProps } from 'react-router-dom';
import styled from 'styled-components';

const LinkIconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    fill: var(--primary-blue);

    transition: var(--transition-200);
  }
`;

const Root = styled(Link)<{ $type: IntegrationInfoLinkVariant }>`
  display: ${p => (p.$type === 'secondary' ? 'inline' : 'flex')};
  align-items: center;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
  color: var(--primary-blue);
  font-weight: ${p => (p.$type === 'secondary' ? 400 : 600)};
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-blue-hover);

    ${LinkIconWrapper} svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    color: var(--button-text-blue-active);

    ${LinkIconWrapper} svg path {
      fill: var(--button-text-blue-active);
    }
  }
`;

type IntegrationInfoLinkVariant = 'primary' | 'secondary';

interface Props extends LinkProps {
  label: string;
  type?: IntegrationInfoLinkVariant;
}

const IntegrationInfoLink = (props: Props) => {
  const { label, type = 'primary', ...rest } = props;

  return (
    <Root $type={type} target="_blank" rel="noopener noreferrer" {...rest}>
      {label}

      {type === 'primary' && (
        <LinkIconWrapper>
          <LinkIcon />
        </LinkIconWrapper>
      )}
    </Root>
  );
};

export { IntegrationInfoLink };
