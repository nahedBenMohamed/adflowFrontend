export class UpdateTutorialGroupDto {
  name: string;
  sortOrder: number;

  private constructor(data: Partial<UpdateTutorialGroupDto>) {
    Object.assign(this, data);
  }

  static create(data: Partial<UpdateTutorialGroupDto>): UpdateTutorialGroupDto {
    return new UpdateTutorialGroupDto(data);
  }
}
