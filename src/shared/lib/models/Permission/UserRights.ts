export class UserRights {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;

  constructor(canView: boolean, canEdit: boolean, canDelete: boolean) {
    this.canView = canView;
    this.canEdit = canEdit;
    this.canDelete = canDelete;
  }
}
