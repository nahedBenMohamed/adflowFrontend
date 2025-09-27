import { Note, startNote } from '../../shared';

class NoteApi {
  private static NOTES_LS_KEY = 'amwork_notes';

  getNotes = (): Note[] => {
    const dto = localStorage.getItem(NoteApi.NOTES_LS_KEY);

    if (!dto) return [startNote];

    return Note.fromDtos(dto);
  };

  saveNotes = (notes: Note[]): void => {
    const dto = Note.toDtos(notes);

    localStorage.setItem(NoteApi.NOTES_LS_KEY, dto);
  };
}

export const noteApi = new NoteApi();
