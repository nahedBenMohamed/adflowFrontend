import styled from 'styled-components';
import { ExpandIcon } from '../../../assets';

const Root = styled.button<{ $expanded: boolean }>`
  width: 16px;
  height: 16px;

  transition: var(--transition-200);
  transform: ${p => (p.$expanded ? 'rotate(0deg)' : 'rotate(180deg)')};

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-blue-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-blue-active);
    }
  }
`;

interface Props {
  expanded: boolean;
  onClick: () => void;
}

const ExpandButton = (props: Props) => {
  const { expanded, onClick } = props;

  return (
    <Root $expanded={expanded} onClick={onClick}>
      <ExpandIcon />
    </Root>
  );
};

export { ExpandButton };
