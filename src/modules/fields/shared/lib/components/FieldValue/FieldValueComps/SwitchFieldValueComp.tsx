import { MySwitchWithModel } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import type { FieldValueBaseProps, SwitchFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const Root = styled.div`
  height: var(--field-component-height);

  display: flex;
  align-items: center;

  padding-left: 8px;
`;

const SwitchFieldValueComp = observer((props: FieldValueBaseProps<SwitchFieldValue>) => {
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

  const handleChange = useCallback(
    (value: boolean) => {
      fieldValue.changeValue(value);

      onChange?.(fieldValue);
    },
    [fieldValue, onChange]
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
      <Root>
        <MySwitchWithModel size="small" model={model} onChange={handleChange} />
      </Root>
    </FieldValueTemplate>
  );
});

SwitchFieldValueComp.displayName = 'SwitchFieldValueComp';
export { SwitchFieldValueComp };
