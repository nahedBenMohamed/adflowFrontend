import { Stage, UrlTemplateUtil } from '@/shared';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';
import { CreateStageDto, UpdateStageDto } from '../dtos';

class StageApi {
  createStage = async ({
    boardId,
    dto,
  }: {
    boardId: number;
    dto: CreateStageDto;
  }): Promise<Stage> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(ApiRoutes.CREATE_STAGE, { boardId }),
      dto
    );

    return Stage.fromDto(response.data);
  };

  getBoardStages = async (boardId: number): Promise<Stage[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ApiRoutes.GET_STAGES, { boardId: boardId })
    );

    return Stage.fromDtos(response.data);
  };

  getStageById = async ({
    stageId,
    boardId,
  }: {
    stageId: number;
    boardId: number;
  }): Promise<Stage> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ApiRoutes.GET_STAGE, { boardId, stageId })
    );

    return Stage.fromDto(response.data);
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
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(ApiRoutes.UPDATE_STAGE, { boardId, stageId }),
      dto
    );

    return Stage.fromDto(response.data);
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
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_STAGE, { boardId, stageId }), {
      params: { newStageId },
    });
  };
}

export const stageApi = new StageApi();
