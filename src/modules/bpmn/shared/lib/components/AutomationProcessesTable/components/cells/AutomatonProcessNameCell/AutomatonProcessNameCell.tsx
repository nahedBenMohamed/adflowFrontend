import { UpdateAutomationProcessDto, useUpdateAutomationProcess } from '@/modules/bpmn/api';
import {
  debounce,
  MyInput,
  PencilButton,
  SpanWithEllipsis,
  TruncateMixin,
  type InputModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef, type KeyboardEventHandler, type RefObject } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

const Root = styled.div<{ $editVisible: boolean }>`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 8px;

  .workspace__PencilButton--Root {
    opacity: ${p => (p.$editVisible ? 1 : 0)};
    scale: ${p => (p.$editVisible ? 1 : 0)};
  }

  &:hover {
    .workspace__PencilButton--Root {
      opacity: 1;
      scale: 1;
    }
  }

  ${TruncateMixin}
`;

const Name = styled(SpanWithEllipsis)`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--primary-blue);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-blue-hover);
  }

  &:active {
    color: var(--button-text-blue-active);
  }
`;

interface Props {
  processId: number;
  model: InputModel;
  handleOpenEditor: () => void;
}

const AutomatonProcessNameCell = observer((props: Props) => {
  const { processId, model, handleOpenEditor } = props;

  const ref = useRef<HTMLDivElement>(null);

  const { mutateAsync: updateAutomationProcess } = useUpdateAutomationProcess(processId);

  const [editMode, { toggle: toggleEditMode, close: hideEditMode }] = useDisclosure(false);

  const handleEnter = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    e => {
      if (e.key !== 'Enter') return;

      hideEditMode();
    },
    [hideEditMode]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeName = useCallback(
    debounce(async (name: string): Promise<void> => {
      const dto = new UpdateAutomationProcessDto({ name });

      await updateAutomationProcess(dto);
    }, 1000),
    [updateAutomationProcess]
  );

  const onChange = useCallback(
    (name: string) => {
      model.setValue(name);

      handleChangeName(name);
    },
    [model, handleChangeName]
  );

  useOnClickOutside(ref as RefObject<HTMLDivElement>, hideEditMode);

  return (
    <Root ref={ref} $editVisible={editMode}>
      {editMode ? (
        <MyInput
          medium
          autoFocus
          alwaysActive
          model={model}
          variant="outlined"
          handleChange={onChange}
          onKeyDown={handleEnter}
        />
      ) : (
        <Name text={model.value} onClick={handleOpenEditor} />
      )}

      <PencilButton onClick={toggleEditMode} />
    </Root>
  );
});

AutomatonProcessNameCell.displayName = 'AutomatonProcessNameCell';
export { AutomatonProcessNameCell };
