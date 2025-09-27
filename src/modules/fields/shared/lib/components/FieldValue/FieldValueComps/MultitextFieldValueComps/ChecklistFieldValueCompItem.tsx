import { ChecklistFieldValue, FieldTextInput, FieldValueBaseProps } from '@/modules/fields';
import { CheckedInputModel, MyCheckboxWithBooleanModel } from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MultitextFieldValueCompTemplate } from './components';

const Root = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;
`;

interface Props extends FieldValueBaseProps<ChecklistFieldValue> {
  model: CheckedInputModel;
}

const ChecklistFieldValueCompItem = observer((props: Props) => {
  const {
    model,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    readonly,
    rightIndicatorOnMobile,
    tableView,
    onChange,
  } = props;

  const models = fieldValue.model;

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    rootRef.current && autoAnimate(rootRef.current);
  }, []);

  const handleChange = useCallback(() => {
    fieldValue.changeValues(models.map(m => m.toChecklistFieldPayloadItem()));

    onChange?.(fieldValue);
  }, [fieldValue, models, onChange]);

  const handleAddOption = useCallback(() => {
    fieldValue.addOption();
  }, [fieldValue]);

  return (
    <MultitextFieldValueCompTemplate
      tableView={tableView}
      filled={model.text.value.length > 0}
      fieldSettings={fieldSettings}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <Root ref={rootRef}>
        {(models.length > 1 || model.text.value.length > 0) && (
          <MyCheckboxWithBooleanModel model={model.checked} handleChange={handleChange} />
        )}

        <FieldTextInput
          type="text"
          noActiveShadow
          model={model.text}
          renderAs="input"
          readonly={readonly}
          onEnter={handleAddOption}
          onChange={handleChange}
        />
      </Root>
    </MultitextFieldValueCompTemplate>
  );
});

ChecklistFieldValueCompItem.displayName = 'ChecklistFieldValueCompItem';
export { ChecklistFieldValueCompItem };
