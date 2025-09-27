import { UtcDate } from '@/shared';
import { Note } from './Note';

export const startNote = new Note({
  id: 0,
  updatedAt: UtcDate.now(),
  content: '',
});
