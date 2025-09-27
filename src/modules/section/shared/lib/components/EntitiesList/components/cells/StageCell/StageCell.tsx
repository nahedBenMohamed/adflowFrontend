import { FieldSelectWrapper } from '@/modules/fields';
import { SelectModel, StagesSelect, type Nullable } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import type { SectionTableRow } from '../../../../../models';

interface Props {
  entityTypeId: number;
  cellContext: CellContext<SectionTableRow, Nullable<number>>;
  showBoardName?: boolean;
  changeStage: ({ id, stageId }: { id: number; stageId: number }) => Promise<boolean>;
}

const StageCell = observer((props: Props) => {
  const { entityTypeId, cellContext, showBoardName, changeStage } = props;

  const stageId = cellContext.getValue();

  const { entityId, readonly } = cellContext.row.original;

  const model = useLocalObservable(() => SelectModel.create(stageId));

  const handleChangeStage = useCallback(
    async ({ newStageId, entityId }: { newStageId: number; entityId: number }): Promise<void> => {
      const changedSuccessfully = await changeStage({ id: entityId, stageId: newStageId });

      if (!changedSuccessfully) model.setValue(stageId);
    },
    [model, stageId, changeStage]
  );

  const onChange = useCallback(
    (stageId: number) => handleChangeStage({ newStageId: stageId, entityId }),
    [entityId, handleChangeStage]
  );

  useEffect(() => {
    model.setValue(stageId);
  }, [stageId, model]);

  const placeholderShown = !model.value;

  return (
    <FieldSelectWrapper $placeholderShown={placeholderShown}>
      <StagesSelect
        withinPortal
        model={model}
        disabled={readonly}
        entityTypeId={entityTypeId}
        showBoardName={showBoardName}
        variant="outlined-without-active-shadow"
        handleChange={onChange}
      />
    </FieldSelectWrapper>
  );
});

StageCell.displayName = 'StageCell';
export { StageCell };
