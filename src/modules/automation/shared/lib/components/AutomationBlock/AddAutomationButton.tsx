import styled from 'styled-components';
import { PlusIcon } from '../../../assets';

const Root = styled.button`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    border-color: var(--button-text-green-hover);
    background-color: var(--button-text-green-hover);

    svg path {
      fill: var(--primary-statuses-white-0);
    }
  }

  &:active {
    border-color: var(--button-text-green-active);
    background-color: var(--button-text-green-active);
  }
`;

interface Props {
  onClick: (...args: any[]) => any;
}

const AddAutomationButton = (props: Props) => {
  const { onClick } = props;

  return (
    <Root onClick={onClick}>
      <PlusIcon />
    </Root>
  );
};

export { AddAutomationButton };
