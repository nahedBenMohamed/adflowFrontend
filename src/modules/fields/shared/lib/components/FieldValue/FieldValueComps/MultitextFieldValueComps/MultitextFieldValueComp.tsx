import { AddFilledButton, InputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useCardFieldHelperContext } from '../../../../../../context';
import type { FieldValueBaseProps, MultitextFieldValue } from '../../../../models';
import { FieldTextInput } from '../../../FieldTextInput/FieldTextInput';
import { MultitextFieldValueCompTemplate, MultitextFieldsWrapper } from './components';

const MultitextFieldValueComp = observer((props: FieldValueBaseProps<MultitextFieldValue>) => {
  const {
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const models = fieldValue.model;

  const helperContext = useCardFieldHelperContext();

  useEffect(() => {
    const values = fieldValue.values.length !== 0 ? fieldValue.values : [''];

    models.replace(values.map(v => InputModel.create(v)));
  }, [fieldValue.values, models]);

  const handleChange = useCallback(() => {
    const values = models.map(m => m.value);

    fieldValue.changeValues(values.filter(i => i.length > 0));

    onChange?.(fieldValue);
  }, [fieldValue, models, onChange]);

  const handleAddField = useCallback(() => models.push(InputModel.create()), [models]);

  const isListView = helperContext?.isListView ?? false;

  const isAddButtonWithMargin = rightIndicatorOnMobile ? false : !isListView && !tableView;

  return (
    <MultitextFieldsWrapper>
      {models.map((m, idx) => {
        if (tableView && idx > 0) return null;

        return (
          <MultitextFieldValueCompTemplate
            key={idx}
            tableView={tableView}
            filled={m.value.length > 0}
            fieldSettings={fieldSettings}
            alwaysHideIndicator={alwaysHideIndicator}
            rightIndicatorOnMobile={rightIndicatorOnMobile}
          >
            <FieldTextInput
              model={m}
              type="text"
              noActiveShadow
              renderAs="input"
              readonly={readonly}
              onChange={handleChange}
            />
          </MultitextFieldValueCompTemplate>
        );
      })}

      {(!tableView || !models.length) && !readonly && (
        <AddFilledButton withLeftMargin={isAddButtonWithMargin} onClick={handleAddField} />
      )}
    </MultitextFieldsWrapper>
  );
});

MultitextFieldValueComp.displayName = 'MultitextFieldValueComp';
export { MultitextFieldValueComp };
