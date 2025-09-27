import type { MailboxSignatureDto } from '../../../../api';

export class MailboxSignature {
  id: number;
  name: string;
  text: string;
  isHtml?: boolean;
  createdBy: number;
  linkedMailboxes: number[];

  constructor({ id, name, text, isHtml, createdBy, linkedMailboxes }: MailboxSignature) {
    this.id = id;
    this.name = name;
    this.text = text;
    this.isHtml = isHtml;
    this.createdBy = createdBy;
    this.linkedMailboxes = linkedMailboxes;
  }

  static fromDto(dto: MailboxSignatureDto): MailboxSignature {
    return new MailboxSignature({
      id: dto.id,
      name: dto.name,
      text: dto.text,
      isHtml: dto.isHtml,
      createdBy: dto.createdBy,
      linkedMailboxes: dto.linkedMailboxes,
    });
  }

  static fromDtos(dtos: MailboxSignatureDto[]): MailboxSignature[] {
    return dtos.map(this.fromDto);
  }
}
