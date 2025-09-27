export class CreateNoteDto {
  text: string;
  fileIds: string[];

  constructor({ text, fileIds }: CreateNoteDto) {
    this.text = text;
    this.fileIds = fileIds;
  }
}
