import { CreateStageDto, stageApiUtil, UpdateStageDto } from '@/app';
import { batchRequest, Stage } from '@/shared';
import { makeAutoObservable } from 'mobx';

export class BoardSettingsStore {
  private _stages: Stage[] = [];

  boardId: number;

  constructor(boardId: number) {
    this.boardId = boardId;

    makeAutoObservable(this);
  }

  get stages(): Stage[] {
    return this._stages;
  }

  get ordinaryStages(): Stage[] {
    return this.stages.filter(s => !s.isSystem);
  }

  get systemStages(): Stage[] {
    return this.stages.filter(s => s.isSystem);
  }

  initStageSettingsGroups = async (): Promise<void> => {
    this._stages = await stageApiUtil.getStagesByBoardId(this.boardId);
  };

  findStage = (
    id: number
  ): {
    id: number;
    idx: number;
    stage: Stage;
  } => {
    const idx = this._stages.findIndex(s => s.id === id);

    const stage = idx === -1 ? null : this._stages[idx];

    if (!stage) throw new Error(`Stage with id ${id} was not found in BoardSettingsStore`);

    return {
      idx,
      stage,
      id: stage.id,
    };
  };

  updateStage = async (stage: Stage): Promise<void> => {
    const dto: UpdateStageDto = {
      id: stage.id,
      name: stage.name,
      color: stage.color,
      code: stage.code,
      isSystem: stage.isSystem,
      sortOrder: stage.sortOrder,
    };

    const updated = await stageApiUtil.updateStage({
      boardId: this.boardId,
      stageId: stage.id,
      dto,
    });

    this._stages.splice(stage.sortOrder, 1);
    this._stages.splice(updated.sortOrder, 0, updated);
  };

  updateSortOrder = async (): Promise<void> => {
    this._stages.forEach(s => {
      const idx = this._stages.indexOf(s);

      if (s.sortOrder !== idx) s.sortOrder = idx;
    });

    batchRequest({
      array: this._stages,
      cb: this.updateStage,
    });
  };

  moveGroup = ({ id, atIdx }: { id: number; atIdx: number }): void => {
    const { stage, idx } = this.findStage(id);

    this._stages.splice(idx, 1);
    this._stages.splice(atIdx, 0, stage);

    this.updateSortOrder();
  };

  addStage = async ({ name, atIdx }: { name: string; atIdx: number }): Promise<void> => {
    const optimisticStage = Stage.createEmpty({ name, boardId: this.boardId, sortOrder: atIdx });

    this._stages.splice(atIdx, 0, optimisticStage);

    const dto: CreateStageDto = {
      name,
      color: 'var(--graphite-graphite-200)',
      code: null,
      sortOrder: atIdx,
      isSystem: false,
    };

    const stage = await stageApiUtil.createStage({ boardId: this.boardId, dto });

    this._stages.splice(atIdx, 1);
    this._stages.splice(atIdx, 0, stage);

    this.updateSortOrder();
  };

  deleteStage = async ({
    boardId,
    stageId,
    newStageId,
  }: {
    boardId: number;
    stageId: number;
    newStageId: number;
  }): Promise<void> => {
    if (this.stages.length === 1)
      throw new Error(
        `Can't delete ${stageId} since it is the last stage, there must be at least one stage left`
      );

    this._stages = this._stages.filter(s => s.id !== stageId);

    await stageApiUtil.deleteStage({ boardId, stageId, newStageId });

    this.updateSortOrder();
  };
}
