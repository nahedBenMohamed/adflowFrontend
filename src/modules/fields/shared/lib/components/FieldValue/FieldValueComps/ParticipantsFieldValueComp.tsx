import { userStore } from '@/app';
import { CreateButton, ParticipantsAvatarRows, UsersMultiselectDropdown } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useWindowSize } from 'usehooks-ts';
import type { FieldValueBaseProps, ParticipantsFieldValue } from '../../../models';
import { FieldValueTemplate } from '../FieldValueTemplate';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const ParticipantsFieldValueComp = observer(
  (props: FieldValueBaseProps<ParticipantsFieldValue>) => {
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

    const { width } = useWindowSize();
    const minified = width < 1340;

    const MAX_INDEX = minified ? 1 : 3;

    const handleChange = useCallback(
      (selectedIds: number[]) => {
        fieldValue.changeUserIds(selectedIds);

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
        <UsersMultiselectDropdown
          width={248}
          withinPortal
          model={model}
          opened={opened}
          disabled={false}
          users={userStore.activeUsers}
          show={open}
          hide={close}
          handleChange={handleChange}
        >
          <Root>
            <CreateButton titleType="add" isButtonFrame active={opened} invalid={!model.isValid} />

            {model.values.length ? (
              <ParticipantsAvatarRows
                model={model}
                maxAvatarCount={MAX_INDEX}
                onChange={handleChange}
              />
            ) : null}
          </Root>
        </UsersMultiselectDropdown>
      </FieldValueTemplate>
    );
  }
);

ParticipantsFieldValueComp.displayName = 'ParticipantsFieldValueComp';
export { ParticipantsFieldValueComp };
