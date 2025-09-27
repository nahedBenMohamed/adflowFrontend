import { MyRadio, type InputModel } from '@/shared';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  display: grid;
  grid-template-columns: calc(40% - 4px) calc(60% - 4px);
  gap: 8px;

  margin-bottom: 8px;
`;

const RadioWrapper = styled.label<{ $alignWithChildren?: boolean }>`
  display: flex;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  padding-top: 8px;
`;

interface Props {
  value: string;
  label: string;
  model: InputModel;
  children?: ReactNode;
  onChange?: (value: string) => void;
}

const IntegrationRadioItem = (props: Props) => {
  const { value, label, model, children, onChange } = props;

  return (
    <Root>
      <RadioWrapper $alignWithChildren={Boolean(children)}>
        <MyRadio value={value} model={model} handleChange={onChange} />

        {label}
      </RadioWrapper>

      {children}
    </Root>
  );
};

export { IntegrationRadioItem };
