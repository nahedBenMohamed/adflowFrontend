import { UtcDate } from '@/shared';

export class Note {
  id: number;
  updatedAt: UtcDate;
  content: string;
  quickNote?: {
    location: string;
    title: string;
  };
  isPinned?: boolean;
  isDeleted?: boolean;

  constructor({ id, updatedAt, content, quickNote, isPinned, isDeleted }: Note) {
    this.id = id;
    this.updatedAt = updatedAt;
    this.content = content;
    this.quickNote = quickNote;
    this.isPinned = isPinned;
    this.isDeleted = isDeleted;
  }

  // DTO methods are temporarily made with strings to store notes in localStorage
  static fromDtos(dto: string): Note[] {
    return (JSON.parse(dto) as any[]).map(
      (n: {
        id: number;
        updatedAt: number;
        content: string;
        quickNote?: { location: string; title: string };
      }) => {
        return { ...n, updatedAt: new UtcDate(n.updatedAt) };
      }
    );
  }

  static toDtos(notes: Note[]): string {
    const dto = notes.map(n => {
      return { ...n, updatedAt: n.updatedAt.timestamp };
    });

    return JSON.stringify(dto);
  }
}
