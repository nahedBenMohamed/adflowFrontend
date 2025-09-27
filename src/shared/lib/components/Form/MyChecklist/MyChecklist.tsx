import { observer } from 'mobx-react-lite';
import { type CSSProperties, useCallback } from 'react';
import styled from 'styled-components';
import type { MultiselectModel, Option } from '../../../models';
import { MyCheckbox } from '../MyCheckbox/MyCheckbox';

const Root = styled.div<{ $padding?: CSSProperties['padding'] }>`
  max-width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;

  ${p => p.$padding && `padding: ${p.$padding}`};
`;

const OptionWrapper = styled.label`
  max-width: 100%;

  display: flex;
  align-items: baseline;
  gap: 8px;

  p {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;

    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    white-space: pre-wrap;
    text-overflow: ellipsis;
    color: var(--button-text-graphite-primary-text);
  }
`;

interface Props {
  model: MultiselectModel<number>;
  options: Option<number>[];
  padding?: CSSProperties['padding'];
  handleChange?: (values: number[]) => void;
}

const MyChecklist = observer((props: Props) => {
  const { model, options, padding, handleChange } = props;

  const handleCheck = useCallback(
    (option: Option<number>) => {
      if (model.values.includes(option.value)) {
        model.setValue(model.values.filter(o => o !== option.value));
      } else {
        model.setValue([...model.values, option.value]);
      }

      handleChange?.(model.values);
    },
    [handleChange, model]
  );

  return (
    <Root $padding={padding}>
      {options.map((o, idx) => (
        <OptionWrapper key={idx}>
          <MyCheckbox checked={model.values.includes(o.value)} onChange={() => handleCheck(o)} />

          <p>{o.label}</p>
        </OptionWrapper>
      ))}
    </Root>
  );
});

MyChecklist.displayName = 'MyChecklist';
export { MyChecklist };
