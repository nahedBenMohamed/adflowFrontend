export class MailboxSignatureDto {
  id: number;
  name: string;
  text: string;
  isHtml?: boolean;
  createdBy: number;
  linkedMailboxes: number[];

  constructor({ id, name, text, isHtml, createdBy, linkedMailboxes }: MailboxSignatureDto) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.isHtml = isHtml;
    this.createdBy = createdBy;
    this.linkedMailboxes = linkedMailboxes;
  }
}
