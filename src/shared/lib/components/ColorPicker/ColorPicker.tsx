import type { FloatingPosition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import { ColorUtil } from '../../utils';
import { MyDropdown } from '../MyDropdown/MyDropdown';

const Picker = styled.div`
  width: 248px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  padding: 8px;
`;

const ColorPickerButton = styled.div<{ $bgColor: string }>`
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  border-radius: 50%;
  border: 1px solid var(--primary-statuses-white-0);
  background-color: ${p => p.$bgColor};
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  &:active {
    box-shadow: none;
  }
`;

const Color = styled.div<{ $bgColor: string }>`
  width: 16px;
  height: 16px;

  border-radius: 50%;
  border: 1px solid var(--primary-statuses-white-0);
  background-color: ${p => p.$bgColor};
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  color: string;
  withinPortal?: boolean;
  position?: FloatingPosition;
  onChange: (color: string) => void;
}

const ColorPicker = observer((props: Props) => {
  const { color, withinPortal = true, position = 'bottom-start', onChange } = props;

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const onSelect = useCallback(
    (color: string) => {
      onChange(color);

      hide();
    },
    [onChange, hide]
  );

  return (
    <MyDropdown
      opened={opened}
      position={position}
      withinPortal={withinPortal}
      Button={<ColorPickerButton $bgColor={color} />}
      hide={hide}
      show={show}
    >
      <Picker>
        {ColorUtil.colors.map(c => (
          <Color key={c} $bgColor={c} onClick={() => onSelect(c)} />
        ))}
      </Picker>
    </MyDropdown>
  );
});

ColorPicker.displayName = 'ColorPicker';
export { ColorPicker };
