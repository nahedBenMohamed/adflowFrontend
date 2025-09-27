import { boardApiUtil } from '@/app';
import type { Nullable } from '@/shared';

export const useGetProjectTaskBoardId = (boardId: Nullable<number>): Nullable<number> => {
  const { data: entityBoard } = boardApiUtil.useGetBoard(boardId);

  if (entityBoard?.taskBoardId) return entityBoard.taskBoardId;

  return null;
};
