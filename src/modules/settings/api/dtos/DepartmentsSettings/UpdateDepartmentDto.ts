export class UpdateDepartmentDto {
  name?: string;
  settings?: {
    workingTimeFrom?: string;
    workingTimeTo?: string;
  };

  constructor({ name, settings }: UpdateDepartmentDto) {
    this.name = name;
    this.settings = settings;
  }
}
