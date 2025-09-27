import { MySelect, type Nullable, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import type { FieldValueBaseProps, SelectFieldValue } from '../../../models';
import { FieldSelectWrapper } from '../FieldSelectWrapper';
import { FieldValueTemplate } from '../FieldValueTemplate';

const SelectFieldValueComp = observer((props: FieldValueBaseProps<SelectFieldValue>) => {
  const {
    field,
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const model = fieldValue.model;

  const handleChange = useCallback(
    (optionId: Nullable<number>) => {
      if (!optionId) {
        fieldValue.changeOptionId(optionId);
        onChange?.(fieldValue);

        return;
      }

      const option = field.optionsToShow.find(o => o.id === optionId);

      if (!option)
        throw new Error(
          `Failed to change field ${field.id} value in SelectFieldValueComp, option not found: ${optionId}`
        );

      fieldValue.changeOptionId(option.id);
      onChange?.(fieldValue);
    },
    [fieldValue, field, onChange]
  );

  const options = useMemo<Option<number>[]>(
    () => field.optionsToShow.map(o => ({ label: o.label, value: o.id })),
    [field.optionsToShow]
  );

  const placeholderShown = !fieldValue.optionId;

  return (
    <FieldValueTemplate
      withSelect
      readonly={readonly}
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
      alwaysHideIndicator={alwaysHideIndicator}
    >
      <FieldSelectWrapper $placeholderShown={placeholderShown}>
        <MySelect
          handleClear
          withinPortal
          model={model}
          options={options}
          variant="outlined-without-active-shadow"
          dropdownMaxWidth={tableView ? 'var(--field-dropdown-max-width)' : undefined}
          handleChange={handleChange}
        />
      </FieldSelectWrapper>
    </FieldValueTemplate>
  );
});

SelectFieldValueComp.displayName = 'SelectFieldValueComp';
export { SelectFieldValueComp };
