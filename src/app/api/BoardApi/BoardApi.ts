import { Board, BoardType, UrlTemplateUtil } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import { type CreateBoardDto, type UpdateBoardDto } from '../dtos';

class BoardApi {
  getBoardsByEntityTypeId = async (entityTypeId: number): Promise<Board[]> => {
    const response = await baseApi.get(ApiRoutes.GET_BOARDS, {
      params: { recordId: entityTypeId },
    });

    return Board.fromDtos(response.data);
  };

  getTasksBoards = async (): Promise<Board[]> => {
    const response = await baseApi.get(ApiRoutes.GET_BOARDS, { params: { type: BoardType.TASK } });

    return Board.fromDtos(response.data);
  };

  getBoardById = async (id: number): Promise<Board> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(ApiRoutes.GET_BOARD, { id }));

    return Board.fromDto(response.data);
  };

  updateBoard = async ({
    dto,
    boardId,
  }: {
    dto: UpdateBoardDto;
    boardId: number;
  }): Promise<Board> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(ApiRoutes.UPDATE_BOARD, { id: boardId }),
      dto
    );

    return Board.fromDto(response.data);
  };

  addBoard = async (dto: CreateBoardDto): Promise<Board> => {
    const response = await baseApi.post(ApiRoutes.ADD_BOARD, dto);

    return Board.fromDto(response.data);
  };

  deleteBoard = async (id: number): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_BOARD, { id }));
  };
}

export const boardApi = new BoardApi();
