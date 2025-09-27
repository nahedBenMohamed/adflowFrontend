import {
  ColorBox,
  DefaultColorSelectButton,
  MyColorPicker,
  type Optional,
  type SelectModel,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.label`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

type PredefinedQuickColorsOptions = 'text' | 'background' | 'dark-background' | 'fancy-background';
type PredefinedDefaultColorOptions = PredefinedQuickColorsOptions;

interface Props {
  model: SelectModel;
  label?: string;
  defaultColorOption?: PredefinedDefaultColorOptions | (string & {});
  quickColorsOptions?: string[] | PredefinedQuickColorsOptions;
}

const ColorRowSelect = observer((props: Props) => {
  const { model, quickColorsOptions, label, defaultColorOption } = props;

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const onChange = useCallback(
    (color: string): void => {
      setValue(color);
      model.setValue(color);
    },
    [model]
  );

  const defaultColor = useMemo<Optional<string>>(() => {
    switch (defaultColorOption) {
      case 'text':
        return '#23282f';

      case 'background':
        return '#ffffff';

      case 'dark-background':
        return '#000000';

      case 'fancy-background':
        return '#69d222';

      default:
        return defaultColorOption;
    }
  }, [defaultColorOption]);

  const onSelectDefaultColor = useCallback(() => {
    if (defaultColor) {
      return onChange(defaultColor);
    } else {
      throw new Error('Failed to select default color. Default color option is not provided.');
    }
  }, [defaultColor, onChange]);

  const colorsOptions = useMemo<string[]>(() => {
    if (quickColorsOptions === 'text')
      return [
        '#23282f',
        '#454f5e',
        '#67778e',
        '#7d8ba1',
        '#94a0b2',
        '#acb5c3',
        '#dbdfe5',
        '#f3f4f6',
        '#f9fafb',
        '#ffffff',
      ];

    if (quickColorsOptions === 'background')
      return [
        '#ffffff',
        '#fff6f5',
        '#fffaf5',
        '#fffdf5',
        '#fcfef6',
        '#23e7b2',
        '#1dd7d7',
        '#2cbdf2',
        '#5293f4',
        '#7e70d7',
      ];

    if (quickColorsOptions === 'dark-background')
      return [
        '#000000',
        '#1a1a1a',
        '#2a2a2a',
        '#3a3a3a',
        '#4a4a4a',
        '#5a5a5a',
        '#6a6a6a',
        '#7a7a7a',
        '#8a8a8a',
        '#9a9a9a',
      ];

    if (quickColorsOptions === 'fancy-background')
      return [
        '#f8654f',
        '#f68828',
        '#fbd437',
        '#69d222',
        '#23e664',
        '#23e7b2',
        '#1dd7d7',
        '#2cbdf2',
        '#7e70d7',
        '#a770d7',
      ];

    return quickColorsOptions ?? [];
  }, [quickColorsOptions]);

  const pickerActive = useMemo<boolean>(
    () => !colorsOptions.includes(value),
    [colorsOptions, value]
  );

  return (
    <Root>
      {label && <Label>{label}</Label>}

      <Content>
        {colorsOptions.length > 0 &&
          colorsOptions.map((c, idx) => (
            <ColorBox key={idx} color={c} active={value === c} onClick={onChange} />
          ))}

        <MyColorPicker model={model} active={pickerActive} hideColorWhenInactive />
      </Content>

      {defaultColor && <DefaultColorSelectButton onClick={onSelectDefaultColor} />}
    </Root>
  );
});

ColorRowSelect.displayName = 'ColorRowSelect';
export { ColorRowSelect };
