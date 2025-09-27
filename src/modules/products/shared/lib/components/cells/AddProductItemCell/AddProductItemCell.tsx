import { AddIconCircled, type InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { WarehouseColumnsIds, WarehouseColumnsSizes } from '../../../models';

const Root = styled.button`
  width: ${WarehouseColumnsSizes[WarehouseColumnsIds.ACTIONS]}px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  transition: var(--transition-200);

  svg path,
  rect {
    transition: var(--transition-200);
  }

  &:hover {
    svg {
      rect {
        stroke: var(--button-text-green-hover);
      }

      path {
        fill: var(--button-text-green-hover);
      }
    }
  }

  &:active {
    svg {
      rect {
        stroke: var(--button-text-green-active);
      }

      path {
        fill: var(--button-text-green-active);
      }
    }
  }

  &:disabled {
    pointer-events: none;

    opacity: 0.5;
  }
`;

interface Props {
  defaultDisabled?: boolean;
  quantity?: InputModel;
  onAdd: () => void;
}

const AddProductItemCell = observer((props: Props) => {
  const { quantity, defaultDisabled, onAdd } = props;

  const [disabled, setDisabled] = useState(false);
  const [valid, setValid] = useState(quantity ? false : true);

  useEffect(() => {
    if (!quantity) return;

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValid(quantity.validate());
  }, [quantity?.value, quantity]);

  const handleClick = () => {
    setDisabled(true);

    onAdd();

    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  return (
    <Root disabled={disabled || !valid || defaultDisabled} onClick={handleClick}>
      <AddIconCircled />
    </Root>
  );
});

AddProductItemCell.displayName = 'AddProductItemCell';
export { AddProductItemCell };
