import { useCardFieldHelperContext } from '@/modules/fields';
import { AddFilledButton, CheckedInputModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { ChecklistFieldValue, FieldValueBaseProps } from '../../../../models';
import { ChecklistFieldValueCompItem } from './ChecklistFieldValueCompItem';
import { MultitextFieldsWrapper } from './components';

const ChecklistFieldValueComp = observer((props: FieldValueBaseProps<ChecklistFieldValue>) => {
  const { readonly, tableView, fieldValue, rightIndicatorOnMobile } = props;

  const models = fieldValue.model;

  const helperContext = useCardFieldHelperContext();

  useEffect(() => {
    const values =
      fieldValue.value.length !== 0 ? fieldValue.value : [{ text: '', checked: false }];

    models.replace(values.map(v => CheckedInputModel.create(v)));
  }, [fieldValue.value, models]);

  const handleAddOption = useCallback(() => {
    fieldValue.addOption();
  }, [fieldValue]);

  const isListView = helperContext?.isListView ?? false;

  const isAddButtonWithMargin = rightIndicatorOnMobile ? false : !isListView && !tableView;

  return (
    <MultitextFieldsWrapper>
      {models.map((m, idx) => {
        if (tableView && idx > 0) return null;

        return <ChecklistFieldValueCompItem key={idx} model={m} tableView={tableView} {...props} />;
      })}

      {(!tableView || !models.length) && !readonly && (
        <AddFilledButton withLeftMargin={isAddButtonWithMargin} onClick={handleAddOption} />
      )}
    </MultitextFieldsWrapper>
  );
});

ChecklistFieldValueComp.displayName = 'ChecklistFieldValueComp';
export { ChecklistFieldValueComp };
