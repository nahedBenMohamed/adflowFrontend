import { DeleteButton, type InputModel } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useDeleteAutomationProcess } from '../../../../../../../api';
import { DeleteAutomationProcessWarning } from '../DeleteAutomationProcessWarning/DeleteAutomationProcessWarning';

const Root = styled.div`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

interface Props {
  name: InputModel;
  processId: number;
}

const DeleteAutomationProcessCell = observer((props: Props) => {
  const { name, processId } = props;

  const { mutateAsync: handleDeleteProcess, isPending: isDeleting } =
    useDeleteAutomationProcess(processId);

  const [isDeleteWarningOpened, { close, open }] = useDisclosure(false);

  const handleApprove = useCallback(async (): Promise<void> => {
    try {
      await handleDeleteProcess();
    } catch (e) {
      throw new Error(`Error while deleting automation process ${processId}: ${e}`);
    } finally {
      close();
    }
  }, [processId, handleDeleteProcess, close]);

  return (
    <Root>
      <DeleteButton onClick={open} />

      {isDeleteWarningOpened && (
        <DeleteAutomationProcessWarning
          isDeleting={isDeleting}
          name={name.trimmedValue}
          isOpened={isDeleteWarningOpened}
          onClose={close}
          onApprove={handleApprove}
        />
      )}
    </Root>
  );
});

DeleteAutomationProcessCell.displayName = 'DeleteAutomationProcessCell';
export { DeleteAutomationProcessCell };
