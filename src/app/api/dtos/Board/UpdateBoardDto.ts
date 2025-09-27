export class UpdateBoardDto {
  name: string;
  sortOrder: number;
  participantIds: number[];

  constructor(data: Partial<UpdateBoardDto>) {
    Object.assign(this, data);
  }
}
