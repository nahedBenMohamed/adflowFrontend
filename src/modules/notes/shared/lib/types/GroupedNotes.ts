import type { Note } from '../models';

export interface GroupedNotes {
  pinned: Note[];
  today: Note[];
  yesterday: Note[];
  earlier: Note[];
}
