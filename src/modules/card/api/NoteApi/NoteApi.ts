import { baseApi } from '@/app';
import { Note, UrlTemplateUtil } from '@/shared';
import { CardApiRoutes } from '../../CardApiRoutes';
import type { CreateNoteDto, UpdateNoteDto } from '../dtos';

class NoteApi {
  addNote = async ({ entityId, dto }: { entityId: number; dto: CreateNoteDto }): Promise<Note> => {
    const response = await baseApi.post(
      UrlTemplateUtil.toPath(CardApiRoutes.ADD_NOTE, { entityId }),
      dto
    );

    return Note.fromDto(response.data);
  };

  updateNote = async ({
    entityId,
    noteId,
    dto,
  }: {
    entityId: number;
    noteId: number;
    dto: UpdateNoteDto;
  }): Promise<void> => {
    await baseApi.put(UrlTemplateUtil.toPath(CardApiRoutes.UPDATE_NOTE, { entityId, noteId }), dto);
  };

  deleteNote = async ({
    entityId,
    noteId,
  }: {
    entityId: number;
    noteId: number;
  }): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(CardApiRoutes.DELETE_NOTE, { entityId, noteId }));
  };
}

export const noteApi = new NoteApi();
