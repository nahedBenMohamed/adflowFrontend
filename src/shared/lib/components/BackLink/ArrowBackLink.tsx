import { cloneElement, isValidElement, memo, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ArrowBackIcon, ArrowBackSmallIcon } from '../../../assets';

interface ArrowBackIconProps {
  $small?: boolean;
  $alignBaseToLeft?: boolean;
}

const ArrowBackIconWrapper = styled.button<ArrowBackIconProps>`
  width: 32px;
  height: 32px;

  ${p =>
    p.$small &&
    css`
      width: 28px;
      height: 28px;
    `}

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  border-radius: ${p => (p.$small ? 'var(--border-radius-element)' : 'var(--border-radius-block)')};
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    background-color: #eff5eb;

    svg path {
      ${p =>
        p.$small
          ? `stroke: var(--button-text-green-active)`
          : `fill: var(--button-text-green-active)`};
    }
  }

  &:active {
    background-color: #e6fbda;

    svg path {
      ${p =>
        p.$small
          ? `stroke: var(--button-text-green-hover)`
          : `fill: var(--button-text-green-hover)`};
    }
  }

  ${p => p.$alignBaseToLeft && `margin-left: -${p.$small ? 4 : 6}px`};
`;

interface BackLinkProps {
  backLink?: string;
  children: ReactElement<{ onClick?: () => void }>;
}

const BackLink = (props: BackLinkProps) => {
  const { backLink, children } = props;

  const navigate = useNavigate();

  const goBack = () => {
    if (backLink) {
      navigate(backLink);
    } else {
      navigate(-1);
    }
  };

  if (!isValidElement(children)) return null;

  return <>{cloneElement(children, { onClick: goBack })}</>;
};

interface Props {
  small?: boolean;
  backLink?: string;
  alignBaseToLeft?: boolean;
}

const ArrowBackLink = memo((props: Props) => {
  const { small, backLink, alignBaseToLeft } = props;

  return (
    <BackLink backLink={backLink}>
      <ArrowBackIconWrapper $small={small} $alignBaseToLeft={alignBaseToLeft}>
        {small ? <ArrowBackSmallIcon /> : <ArrowBackIcon />}
      </ArrowBackIconWrapper>
    </BackLink>
  );
});

ArrowBackLink.displayName = 'ArrowBackLink';
export { ArrowBackLink, BackLink };
