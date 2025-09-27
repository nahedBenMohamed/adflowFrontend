export class CreateTutorialGroupDto {
  name: string;
  sortOrder: number;

  constructor({ name, sortOrder }: CreateTutorialGroupDto) {
    this.name = name;
    this.sortOrder = sortOrder;
  }
}
