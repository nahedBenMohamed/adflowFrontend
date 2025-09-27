import { boardApi, type CreateBoardDto, stageApiUtil } from '@/app';
import { queryClient } from '@/index';
import type { Board, Nullable, Option, Optional } from '@/shared';
import {
  queryOptions,
  skipToken,
  useQueries,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../AppQueryKeys';
import { UpdateBoardDto } from '../dtos';

const BOARDS_STALE_TIME = 10 * 60 * 1000;

// this class encapsulate all board-related queries and helpers
// this is in fact static class, but do not refactor methods to static,
// because this will violate the rules of hooks
class BoardApiUtil {
  private _getBoardQueryOptions = (boardId: Optional<Nullable<number>>) => {
    return queryOptions({
      queryKey: APP_QUERY_KEYS.board(boardId),
      queryFn: boardId ? async (): Promise<Board> => boardApi.getBoardById(boardId) : skipToken,
      staleTime: BOARDS_STALE_TIME,
    });
  };

  private _getBoardsByEntityTypeIdQueryOptions = ({
    entityTypeId,
    enabled,
  }: {
    entityTypeId: Optional<Nullable<number>>;
    enabled?: boolean;
  }) => {
    return queryOptions({
      queryKey: APP_QUERY_KEYS.boardsByEntityTypeId(entityTypeId),
      queryFn: entityTypeId
        ? async (): Promise<Board[]> => boardApi.getBoardsByEntityTypeId(entityTypeId)
        : skipToken,
      staleTime: BOARDS_STALE_TIME,
      enabled,
    });
  };

  private _getTasksBoardsQueryOptions = () => {
    return queryOptions({
      queryKey: APP_QUERY_KEYS.tasksBoards(),
      staleTime: BOARDS_STALE_TIME,
      queryFn: boardApi.getTasksBoards,
    });
  };

  useGetBoard = (boardId: Optional<Nullable<number>>): UseQueryResult<Board, Error> => {
    return useQuery(this._getBoardQueryOptions(boardId));
  };

  useGetBoardsByEntityTypeId = ({
    entityTypeId,
    enabled,
  }: {
    entityTypeId: Optional<Nullable<number>>;
    enabled?: boolean;
  }): UseQueryResult<Board[], Error> => {
    return useQuery(this._getBoardsByEntityTypeIdQueryOptions({ entityTypeId, enabled }));
  };

  useGetBoardsByEntityTypeIds = (
    entityTypeIds: number[]
  ): (UseQueryResult<Board[], Error> & { et?: number })[] => {
    return useQueries({
      queries: entityTypeIds.map(entityTypeId =>
        this._getBoardsByEntityTypeIdQueryOptions({ entityTypeId })
      ),
      combine: res => res.map((r, idx) => ({ ...r, et: entityTypeIds[idx] })),
    });
  };

  useGetBoardsByEntityTypeIdOptions = (
    entityTypeId: Optional<Nullable<number>>
  ): Option<number>[] => {
    const { data: boards } = useQuery(this._getBoardsByEntityTypeIdQueryOptions({ entityTypeId }));

    return (
      boards?.map<Option<number>>(b => ({
        value: b.id,
        label: b.name,
      })) ?? []
    );
  };

  useGetTasksBoards = (): UseQueryResult<Board[], Error> => {
    return useQuery(this._getTasksBoardsQueryOptions());
  };

  getBoard = async (boardId: number): Promise<Board> => {
    return await queryClient.ensureQueryData(this._getBoardQueryOptions(boardId));
  };

  invalidateBoards = async (): Promise<void> => {
    await queryClient.invalidateQueries({ queryKey: APP_QUERY_KEYS.boards });
  };

  updateBoard = async ({
    boardId,
    dto,
  }: {
    boardId: number;
    dto: UpdateBoardDto;
  }): Promise<void> => {
    await boardApi.updateBoard({ dto, boardId });

    this.invalidateBoards();
  };

  addBoard = async (dto: CreateBoardDto): Promise<void> => {
    try {
      await boardApi.addBoard(dto);

      await Promise.all([stageApiUtil.invalidateStages(), this.invalidateBoards()]);
    } catch (e) {
      throw new Error(`Error while adding board ${dto.name}: ${e}`);
    }
  };

  deleteBoard = async (boardId: number): Promise<void> => {
    try {
      await boardApi.deleteBoard(boardId);
    } catch (e) {
      console.log(`Failed to delete board: ${e}`);
    }

    this.invalidateBoards();
  };

  changeBoardSortOrder = async ({
    boardId,
    newSortOrder,
  }: {
    boardId: number;
    newSortOrder: number;
  }): Promise<void> => {
    const dto = new UpdateBoardDto({ sortOrder: newSortOrder });

    try {
      await boardApi.updateBoard({ dto, boardId });
    } catch (error) {
      console.error(`Failed to change board sortOrder: ${error}`);
    } finally {
      this.invalidateBoards();
    }
  };
}

export const boardApiUtil = new BoardApiUtil();
