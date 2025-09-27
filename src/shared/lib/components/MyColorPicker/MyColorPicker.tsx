import { MyInput, type Optional, validateColorHex } from '@/shared';
import type { FloatingPosition } from '@mantine/core';
import { ColorPicker } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { InputModel, type SelectModel } from '../../models';
import { MyDropdown } from '../MyDropdown/MyDropdown';
import { MyColorPickerDefaultButton } from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  padding: 8px;
`;

interface Props {
  model: SelectModel;
  active?: boolean;
  Button?: ReactNode;
  withinPortal?: boolean;
  position?: FloatingPosition;
  hideColorWhenInactive?: boolean;
}

const MyColorPicker = observer((props: Props) => {
  const {
    model,
    active,
    withinPortal,
    position = 'bottom-start',
    Button,
    hideColorWhenInactive,
  } = props;

  const [value, setValue] = useState(model.value);
  const [opened, { close, open }] = useDisclosure(false);

  const inputModel = useMemo(() => InputModel.create().colorHex(), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);

    inputModel.setValue(model.value);
  }, [inputModel, model.value]);

  const onChange = useCallback(
    (color: string): void => {
      if (validateColorHex(color)) {
        setValue(color);
        model.setValue(color);
      }
    },
    [model]
  );

  const pickerColor = useMemo<Optional<string>>(() => {
    if (!hideColorWhenInactive) return value;

    return active ? value : undefined;
  }, [active, hideColorWhenInactive, value]);

  return (
    <MyDropdown
      opened={opened}
      position={position}
      withinPortal={withinPortal}
      Button={
        Button ?? <MyColorPickerDefaultButton color={pickerColor} active={active || opened} />
      }
      hide={close}
      show={open}
    >
      <Root>
        <ColorPicker value={value} onChange={onChange} />

        <MyInput
          maxLength={7}
          placeholder="HEX"
          model={inputModel}
          variant="outlined"
          handleChange={onChange}
        />
      </Root>
    </MyDropdown>
  );
});

MyColorPicker.displayName = 'MyColorPicker';
export { MyColorPicker };
