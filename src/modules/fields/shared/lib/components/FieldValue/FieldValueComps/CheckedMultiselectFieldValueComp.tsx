import { MyChecklist, type Option } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import type { FieldValueBaseProps, MultiselectFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const Label = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const CheckedMultiselectFieldValueComp = observer(
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

    const options = useMemo<Option<number>[]>(
      () =>
        field.options.map(o => ({
          label: o.label,
          value: o.id,
        })),
      [field.options]
    );

    const selectedOptionsLabel = useMemo(
      () => model.values.map(v => options.find(o => o.value === v)?.label).join(', '),
      [model.values, options]
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
        {tableView ? (
          <Label>{selectedOptionsLabel}</Label>
        ) : (
          <MyChecklist
            model={model}
            options={options}
            padding="6px 0 0 8px"
            handleChange={handleChange}
          />
        )}
      </FieldValueTemplate>
    );
  }
);

CheckedMultiselectFieldValueComp.displayName = 'CheckedMultiselectFieldValueComp';
export { CheckedMultiselectFieldValueComp };
