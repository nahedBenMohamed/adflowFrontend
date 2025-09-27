import { useGetTasksFieldsOptions } from '@/modules/builder';
import type { TaskFieldCode } from '@/modules/tasks';
import { MultiselectModel, MultiselectWithCheckboxes, SettingsTwoLinesIcon } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

const GearIconWrapper = styled.button<{ $active: boolean }>`
  position: relative;

  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-green-hover);
    }
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-active);
      }
    `}
`;

interface Props {
  activeFields: TaskFieldCode[];
  onSelect: (activeFields: string[]) => void;
}

const TaskSettingsDropdown = observer((props: Props) => {
  const { activeFields, onSelect } = props;

  const selectedFieldsModel = useLocalObservable(() => MultiselectModel.create(activeFields));

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const taskFieldsOptions = useGetTasksFieldsOptions();

  const handlers = useMemo(
    () => ({
      opened,
      show,
      hide,
    }),
    [opened, show, hide]
  );

  return (
    <MultiselectWithCheckboxes
      dropdownMinWidth="280px"
      model={selectedFieldsModel}
      options={taskFieldsOptions}
      overrideShowHideHandlers={handlers}
      CustomButton={
        <GearIconWrapper $active={opened}>
          <SettingsTwoLinesIcon />
        </GearIconWrapper>
      }
      handleChange={onSelect}
    />
  );
});

TaskSettingsDropdown.displayName = 'TaskSettingsDropdown';
export { TaskSettingsDropdown };
