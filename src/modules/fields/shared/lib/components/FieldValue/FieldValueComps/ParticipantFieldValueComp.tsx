import { userStore } from '@/app';
import { TruncateMixin, UserPicker, type Nullable, type User } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import type { FieldValueBaseProps, ParticipantFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const Root = styled.div`
  ${TruncateMixin}
`;

const ParticipantFieldValueComp = observer((props: FieldValueBaseProps<ParticipantFieldValue>) => {
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
    (user: Nullable<User>) => {
      const userId = user?.id ?? null;

      model.setValue(userId);
      fieldValue.changeValue(userId);

      onChange?.(fieldValue);
    },
    [model, fieldValue, onChange]
  );

  const handleClear = useCallback(() => handleChange(null), [handleChange]);

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
        <UserPicker
          withinPortal
          noActiveShadow
          selectedId={model.value}
          users={userStore.activeUsers}
          onClear={handleClear}
          onSelect={handleChange}
        />
      </Root>
    </FieldValueTemplate>
  );
});

ParticipantFieldValueComp.displayName = 'ParticipantFieldValueComp';
export { ParticipantFieldValueComp };
