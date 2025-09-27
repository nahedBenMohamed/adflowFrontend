import { CreateStageDto, UpdateStageDto } from '@/app';
import { queryClient } from '@/index';
import type { Nullable, Optional, Stage } from '@/shared';
import {
  queryOptions,
  skipToken,
  useQueries,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../AppQueryKeys';
import { stageApi } from './StageApi';

const STAGES_STALE_TIME = 10 * 60 * 1000;

// this class encapsulate all stages-related queries and helpers
// this is in fact static class, but do not refactor methods to static,
// because this will violate the rules of hooks
class StageApiUtil {
  private _getStageQueryOptions = ({
    stageId,
    boardId,
    enabled,
  }: {
    stageId: Optional<Nullable<number>>;
    boardId: Optional<Nullable<number>>;
    enabled?: boolean;
  }) => {
    return queryOptions({
      queryKey: APP_QUERY_KEYS.stage({ stageId, boardId }),
      queryFn:
        stageId && boardId
          ? async (): Promise<Stage> => await stageApi.getStageById({ stageId, boardId })
          : skipToken,
      staleTime: STAGES_STALE_TIME,
      enabled,
    });
  };

  private _getStagesByBoardIdQueryOptions = ({
    boardId,
    enabled,
  }: {
    boardId: Optional<Nullable<number>>;
    enabled?: boolean;
  }) => {
    return queryOptions({
      queryKey: APP_QUERY_KEYS.stagesByBoardId(boardId),
      queryFn: boardId
        ? async (): Promise<Stage[]> => await stageApi.getBoardStages(boardId)
        : skipToken,
      staleTime: STAGES_STALE_TIME,
      enabled,
    });
  };

  useGetStage = ({
    stageId,
    boardId,
    enabled,
  }: {
    stageId: Optional<Nullable<number>>;
    boardId: Optional<Nullable<number>>;
    enabled?: boolean;
  }): UseQueryResult<Stage, Error> => {
    return useQuery(this._getStageQueryOptions({ stageId, boardId, enabled }));
  };

  useGetStagesByBoardId = ({
    boardId,
    enabled,
  }: {
    boardId: Optional<Nullable<number>>;
    enabled?: boolean;
  }): UseQueryResult<Stage[], Error> => {
    return useQuery(this._getStagesByBoardIdQueryOptions({ boardId, enabled }));
  };

  useGetStagesByBoardIds = (boardIds: number[]): Stage[] => {
    return useQueries({
      queries: boardIds.map(boardId => this._getStagesByBoardIdQueryOptions({ boardId })),
      combine: res => {
        if (res.some(r => r.isLoading)) return [];

        const data: Stage[] = [];

        res.forEach(r => {
          if (r.data) data.push(...r.data);
        });

        return data;
      },
    });
  };

  getStagesByBoardId = async (boardId: Optional<Nullable<number>>): Promise<Stage[]> => {
    return await queryClient.ensureQueryData(this._getStagesByBoardIdQueryOptions({ boardId }));
  };

  invalidateStages = async (): Promise<void> => {
    await queryClient.refetchQueries({ queryKey: APP_QUERY_KEYS.stages });
  };

  createStage = async ({
    boardId,
    dto,
  }: {
    boardId: number;
    dto: CreateStageDto;
  }): Promise<Stage> => {
    const stage = await stageApi.createStage({ boardId, dto });

    this.invalidateStages();

    return stage;
  };

  updateStage = async ({
    boardId,
    stageId,
    dto,
  }: {
    boardId: number;
    stageId: number;
    dto: UpdateStageDto;
  }): Promise<Stage> => {
    const stage = await stageApi.updateStage({ boardId, stageId, dto });

    this.invalidateStages();

    return stage;
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
    await stageApi.deleteStage({ boardId, stageId, newStageId });

    this.invalidateStages();
  };
}

export const stageApiUtil = new StageApiUtil();
