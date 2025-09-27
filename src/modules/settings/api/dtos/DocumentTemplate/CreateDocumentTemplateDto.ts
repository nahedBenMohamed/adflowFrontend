export class CreateDocumentTemplateDto {
  name: string;
  fileId: string;
  accessibleBy: number[];
  entityTypeIds: number[];

  constructor({ name, fileId, accessibleBy, entityTypeIds }: CreateDocumentTemplateDto) {
    this.name = name;
    this.fileId = fileId;
    this.accessibleBy = accessibleBy;
    this.entityTypeIds = entityTypeIds;
  }
}
