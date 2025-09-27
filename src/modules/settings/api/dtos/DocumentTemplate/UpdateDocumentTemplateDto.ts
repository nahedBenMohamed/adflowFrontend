export class UpdateDocumentTemplateDto {
  name: string;
  fileId: string;
  accessibleBy: number[];
  entityTypeIds: number[];

  constructor({ name, fileId, accessibleBy, entityTypeIds }: UpdateDocumentTemplateDto) {
    this.name = name;
    this.fileId = fileId;
    this.accessibleBy = accessibleBy;
    this.entityTypeIds = entityTypeIds;
  }
}
