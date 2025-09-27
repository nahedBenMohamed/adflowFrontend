import { FormItemLabel, type InputModel, MyRadio, SpanWithEllipsis } from '@/shared';
import styled from 'styled-components';

const Root = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props {
  value: string;
  label: string;
  model: InputModel;
}

const AutomationRadioButton = (props: Props) => {
  const { value, label, model } = props;

  return (
    <Root>
      <MyRadio model={model} value={value} />

      <FormItemLabel $color="var(--button-text-graphite-primary-text)">
        <SpanWithEllipsis text={label} />
      </FormItemLabel>
    </Root>
  );
};

export { AutomationRadioButton };
