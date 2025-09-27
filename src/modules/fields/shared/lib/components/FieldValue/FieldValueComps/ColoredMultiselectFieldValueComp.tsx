import { ColorUtil, MyMultiselectColored, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import type { FieldValueBaseProps, MultiselectFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const ColoredMultiselectFieldValueComp = observer(
  (props: FieldValueBaseProps<MultiselectFieldValue>) => {
    const {
      readonly,
      field,
      tableView,
      fieldValue,
      fieldSettings,
      alwaysHideIndicator,
      rightIndicatorOnMobile,
      onChange,
    } = props;

    const model = fieldValue.model;

    const handleChange = useCallback(
      (optionIds: number[]) => {
        fieldValue.changeOptionIds(optionIds);

        onChange?.(fieldValue);
      },
      [fieldValue, onChange]
    );

    const options = useMemo<Option<number, { bgColor: string }>[]>(
      () =>
        field.options.map(o => ({
          label: o.label,
          value: o.id,
          extra: { bgColor: o.color ?? ColorUtil.getDefaultBgColor() },
        })),
      [field.options]
    );

    return (
      <FieldValueTemplate
        readonly={readonly}
        tableView={tableView}
        settings={fieldSettings}
        filled={fieldValue.filled()}
        alwaysHideIndicator={alwaysHideIndicator}
        rightIndicatorOnMobile={rightIndicatorOnMobile}
      >
        <MyMultiselectColored
          withinPortal
          model={model}
          options={options}
          tableView={tableView}
          handleChange={handleChange}
        />
      </FieldValueTemplate>
    );
  }
);

ColoredMultiselectFieldValueComp.displayName = 'ColoredMultiselectFieldValueComp';
export { ColoredMultiselectFieldValueComp };
