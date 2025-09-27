import { UtcDate, type Nullable, type Optional } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { noteApi } from '../api';
import { Note, startNote, type GroupedNotes, type NoteFolders } from '../shared';

class NoteStore {
  notes: Note[] = [];
  selectedNote = 0;
  selectedFolder: NoteFolders = 'all';

  modalOpened = false;

  constructor() {
    makeAutoObservable(this);
  }

  get currentlySelectedNoteId(): number {
    return this.selectedNote;
  }

  get modalState(): boolean {
    return this.modalOpened;
  }

  get allNotesCount(): number {
    return this.notes.filter(n => !n.isDeleted).length;
  }

  get recentlyRemovedNotes(): Note[] {
    return this.notes.filter(n => n.isDeleted);
  }

  get recentlyRemovedNotesCount(): number {
    return this.recentlyRemovedNotes.length;
  }

  get groupedNotes(): GroupedNotes {
    let pinned: Note[] = [];
    let today: Note[] = [];
    let yesterday: Note[] = [];
    let earlier: Note[] = [];
    let notes: Note[] = [];

    if (this.selectedFolder === 'all') {
      notes = this.notes.filter(n => !n.isDeleted);
    } else if (this.selectedFolder === 'recently-deleted') {
      notes = this.recentlyRemovedNotes;
    }

    for (let note of notes) {
      if (note.isPinned) {
        pinned.push(note);
      } else if (note.updatedAt.isToday()) {
        today.push(note);
      } else if (note.updatedAt.isYesterday()) {
        yesterday.push(note);
      } else {
        earlier.push(note);
      }
    }

    return { pinned, today, yesterday, earlier };
  }

  loadData = (): void => {
    this.notes = noteApi.getNotes();
    this.selectedNote = this.notes?.[0]?.id ?? 0;
  };

  getNoteById = (id: number): Note => {
    const note = this.notes.find(n => n.id === id);

    if (!note) throw new Error(`Note with id ${id} not found`);

    return note;
  };

  findNoteById = (id: number): Optional<Note> => {
    return this.notes.find(n => n.id === id);
  };

  getSiblingNoteId = (noteId: number): Nullable<number> => {
    const note = this.getNoteById(noteId);

    const noteIdx = this.notes.indexOf(note);

    if (noteIdx === -1) return null;

    const previousSibling = this.notes[noteIdx - 1];
    const nextSibling = this.notes[noteIdx + 1];

    if (previousSibling) {
      return previousSibling.id;
    } else if (nextSibling) {
      return nextSibling.id;
    } else {
      return null;
    }
  };

  getCurrentlySelectedNote = (): Note => {
    return this.findNoteById(this.selectedNote) ?? startNote;
  };

  selectNote = (id: number): void => {
    if (this.getNoteById(id)) this.selectedNote = id;

    this.saveNotes();
  };

  selectFolder = (folder: NoteFolders): void => {
    this.selectedFolder = folder;
  };

  saveNotes = (): void => {
    noteApi.saveNotes(this.notes);
  };

  updateNote = (note: Note): void => {
    const idx = this.notes.findIndex(n => n.id === note.id);

    if (idx === -1) return;

    this.notes[idx] = note;

    this.sortByDate();
    this.saveNotes();
  };

  createNote = (heading: string, quickNote?: { location: string; title: string }): void => {
    const newId = Math.max(...this.notes.map<number>(n => n.id)) + 1;
    const now = UtcDate.now();

    this.notes.unshift(
      new Note({
        id: newId,
        updatedAt: now,
        content: `<h1>${heading}</h1>`,
        quickNote: quickNote,
      })
    );

    this.selectNote(newId);
  };

  deleteNote = (noteId: number): void => {
    const note = this.getNoteById(noteId);

    if (note.isDeleted) {
      if (this.recentlyRemovedNotesCount === 1) this.selectFolder('all');

      const siblingNoteId = this.getSiblingNoteId(note.id);

      this.notes = this.notes.filter(n => n.id !== note.id);
      this.selectNote(siblingNoteId ?? 0);
    } else {
      if (this.allNotesCount === 1) {
        const newNoteId = Math.max(...this.notes.map(n => n.id)) + 1;

        this.notes.unshift(
          new Note({
            id: newNoteId,
            updatedAt: UtcDate.now(),
            content: '',
          })
        );

        this.selectNote(newNoteId);
      }

      note.isDeleted = true;
      this.updateNote(note);

      const siblingNoteId = this.getSiblingNoteId(note.id);

      if (siblingNoteId) this.selectNote(siblingNoteId);
    }
  };

  restoreNote = (noteId: number): void => {
    const note = this.getNoteById(noteId);

    note.isDeleted = false;
    this.updateNote(note);

    if (this.recentlyRemovedNotesCount === 0) this.selectFolder('all');
  };

  duplicateNote = (noteId: number): void => {
    const note = this.getNoteById(noteId);

    const newId = Math.max(...this.notes.map(n => n.id)) + 1;
    const now = UtcDate.now();

    this.notes.splice(
      noteId,
      0,
      new Note({
        id: newId,
        updatedAt: now,
        content: note.content,
        quickNote: note.quickNote,
      })
    );
  };

  sortByDate = (): void => {
    this.notes = this.notes.sort((a, b) => b.updatedAt.timestamp - a.updatedAt.timestamp);
  };

  toggleModal = (): void => {
    this.modalOpened = !this.modalOpened;
  };

  ensureCloseModal = (): void => {
    this.modalOpened = false;
  };

  selectQuickNoteForLocation = (location: string): boolean => {
    const idx = this.notes.findIndex(n => n.quickNote?.location === location);

    if (idx === -1) return false;

    const noteId = this.notes[idx]?.id;

    if (!noteId) return false;

    this.selectNote(noteId);

    return true;
  };

  handleQuickNote = (heading: string, location: string, title: string): void => {
    if (this.selectQuickNoteForLocation(location)) return;

    this.createNote(heading, { location, title });
  };

  removeQuickProperty = (note: Note): void => {
    const newNote = { ...note, quickNote: undefined };

    this.updateNote(newNote);
  };

  togglePin = (id: number): void => {
    const note = this.getNoteById(id);

    const newNote = { ...note, isPinned: !note.isPinned };
    this.updateNote(newNote);
  };
}

export const noteStore = new NoteStore();
