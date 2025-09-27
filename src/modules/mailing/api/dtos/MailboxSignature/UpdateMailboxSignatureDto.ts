export class UpdateMailboxSignatureDto {
  name: string;
  text: string;
  isHtml?: boolean;
  linkedMailboxes: number[];

  constructor({ name, text, isHtml, linkedMailboxes }: UpdateMailboxSignatureDto) {
    this.name = name;
    this.text = text;
    this.isHtml = isHtml;
    this.linkedMailboxes = linkedMailboxes;
  }
}
