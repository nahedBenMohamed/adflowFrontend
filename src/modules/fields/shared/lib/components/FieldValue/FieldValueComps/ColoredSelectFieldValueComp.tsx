import { ColorUtil, MySelectColored, type Nullable, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import type { ColoredSelectFieldValue, FieldValueBaseProps } from '../../../models';
import { FieldSelectWrapper } from '../FieldSelectWrapper';
import { FieldValueTemplate } from '../FieldValueTemplate';

const ColoredSelectFieldValueComp = observer(
  (props: FieldValueBaseProps<ColoredSelectFieldValue>) => {
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
            `Failed to change field ${field.id} value in ColoredSelectFieldValueComp, option not found: ${optionId}`
          );

        fieldValue.changeOptionId(option.id);
        onChange?.(fieldValue);
      },
      [fieldValue, field, onChange]
    );

    const options = useMemo<Option<number, { bgColor: string }>[]>(
      () =>
        field.optionsToShow.map(o => ({
          label: o.label,
          value: o.id,
          extra: { bgColor: o.color ?? ColorUtil.getDefaultBgColor() },
        })),
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
        alwaysHideIndicator={alwaysHideIndicator}
        rightIndicatorOnMobile={rightIndicatorOnMobile}
      >
        <FieldSelectWrapper $placeholderShown={placeholderShown}>
          <MySelectColored
            handleClear
            withinPortal
            model={model}
            options={options}
            variant="outlined-without-active-shadow"
            dropdownMinWidth="var(--field-dropdown-min-width)"
            dropdownMaxWidth={tableView ? 'var(--field-dropdown-max-width)' : undefined}
            handleChange={handleChange}
          />
        </FieldSelectWrapper>
      </FieldValueTemplate>
    );
  }
);

ColoredSelectFieldValueComp.displayName = 'ColoredSelectFieldValueComp';
export { ColoredSelectFieldValueComp };
