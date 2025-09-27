import { MyInputNumber, type NumberModel } from '@/shared';
import type { CSSProperties } from 'react';
import styled from 'styled-components';

const IntervalInputWrapper = styled.div`
  position: relative;

  input {
    padding-right: 20px;
  }
`;

const InputUnit = styled.div`
  position: absolute;
  bottom: 3px;
  right: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

interface Props {
  model: NumberModel;
  unit: string;
  width: CSSProperties['width'];
}

const IntervalInput = (props: Props) => {
  const { model, unit, width } = props;

  return (
    <IntervalInputWrapper>
      <MyInputNumber min={1} width={width} model={model} variant="outlined" />

      <InputUnit>{unit}</InputUnit>
    </IntervalInputWrapper>
  );
};

export { IntervalInput };
