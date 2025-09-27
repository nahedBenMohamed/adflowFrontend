export class CreateMailboxSignatureDto {
  name: string;
  text: string;
  isHtml?: boolean;
  linkedMailboxes: number[];

  constructor({ name, text, isHtml, linkedMailboxes }: CreateMailboxSignatureDto) {
    this.name = name;
    this.text = text;
    this.isHtml = isHtml;
    this.linkedMailboxes = linkedMailboxes;
  }
}
