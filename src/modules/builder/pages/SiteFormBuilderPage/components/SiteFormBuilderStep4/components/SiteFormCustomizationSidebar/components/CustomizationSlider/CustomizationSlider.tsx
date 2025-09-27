import type { NumberModel } from '@/shared';
import { Slider, type SliderProps } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
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

const StyledSlider = styled(Slider)`
  height: 48px;
  width: 90%;

  align-self: center;

  .mantine-Slider-markLabel {
    color: var(--button-text-graphite-primary-text);

    margin-top: 4px;
  }

  .mantine-Slider-thumb {
    border-color: var(--primary-statuses-green-520);
  }

  .mantine-Slider-bar {
    background-color: var(--primary-statuses-green-520);
  }

  .mantine-Slider-track {
    &::before {
      background-color: var(--graphite-graphite-80);
    }
  }

  .mantine-Slider-mark {
    border-color: var(--graphite-graphite-80);

    &.mantine-Slider-markFilled {
      border-color: var(--primary-statuses-green-520);
    }
  }

  .mantine-Slider-label {
    border: none;

    top: -32px;

    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: var(--primary-statuses-white-0);

    padding: 2px 8px;
    background-color: var(--button-text-graphite-primary-text);
  }
`;

interface Props extends Omit<SliderProps, 'value' | 'onChange'> {
  model: NumberModel;
  blockLabel?: string;
}

const CustomizationSlider = observer((props: Props) => {
  const { model, blockLabel, ...rest } = props;

  const [value, setValue] = useState<number>(model.value ?? 0);

  useEffect(() => {
    model.setValue(value);
  }, [model, value]);

  const handleChange = useCallback(
    (value: number) => {
      setValue(value);
      model.setValue(value);
    },
    [model]
  );

  return (
    <Root>
      {blockLabel && <Label>{blockLabel}</Label>}

      <StyledSlider {...rest} value={value} onChange={handleChange} />
    </Root>
  );
});

CustomizationSlider.displayName = 'CustomizationSlider';
export { CustomizationSlider };
