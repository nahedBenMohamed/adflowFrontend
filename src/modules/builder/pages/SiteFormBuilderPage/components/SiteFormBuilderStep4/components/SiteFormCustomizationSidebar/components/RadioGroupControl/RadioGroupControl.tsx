import { MyRadio, type InputModel, type Option, type Optional } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Label = styled.strong`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);
`;

const RadioWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const RadioLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  label: string;
  model: InputModel;
  options: Option<string, Optional<{ Icon?: ReactNode }>>[];
}

const RadioGroupControl = (props: Props) => {
  const { label, model, options } = props;

  return (
    <Root>
      <Label>{label}</Label>

      {options.map(o => (
        <RadioWrapper key={o.value}>
          <MyRadio model={model} value={o.value} />

          <RadioLabelWrapper>
            {o.extra?.Icon && <IconWrapper>{o.extra?.Icon}</IconWrapper>}

            {o.label}
          </RadioLabelWrapper>
        </RadioWrapper>
      ))}
    </Root>
  );
};

export { RadioGroupControl };
