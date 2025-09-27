import styled, { css } from 'styled-components';
import { FormatIcon } from '../../../../../../assets';

const Root = styled.div<{ $active: boolean }>`
  svg path {
    transition: var(--transition-200);
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-hover);
      }
    `}

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-active);
    }
  }
`;

interface Props {
  active: boolean;
  onClick: () => void;
}

const FormatTextControl = (props: Props) => {
  const { active, onClick } = props;

  return (
    <Root onClick={onClick} $active={active}>
      <FormatIcon />
    </Root>
  );
};

export { FormatTextControl };
