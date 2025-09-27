import { MyDatePickerSelect, type UtcDateValue } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import type { DateFieldValue, FieldValueBaseProps } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const DateFieldValueComp = observer((props: FieldValueBaseProps<DateFieldValue>) => {
  const {
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    onChange,
  } = props;

  const model = fieldValue.model;

  const [opened, { close, open }] = useDisclosure(false);

  const handleChange = useCallback(
    (value: UtcDateValue) => {
      fieldValue.changeValue(value);

      onChange?.(fieldValue);
    },
    [fieldValue, onChange]
  );

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
      <MyDatePickerSelect
        clearable
        withinPortal
        model={model}
        type="default"
        opened={opened}
        variant="empty-without-arrow"
        show={open}
        hide={close}
        handleChange={handleChange}
      />
    </FieldValueTemplate>
  );
});

DateFieldValueComp.displayName = 'DateFieldValueComp';
export { DateFieldValueComp };
