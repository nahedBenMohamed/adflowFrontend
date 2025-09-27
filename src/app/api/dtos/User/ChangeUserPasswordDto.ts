export class ChangeUserPasswordDto {
  currentPassword: string;
  newPassword: string;

  constructor({ currentPassword, newPassword }: ChangeUserPasswordDto) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }
}
