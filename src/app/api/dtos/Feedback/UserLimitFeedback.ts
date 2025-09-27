export class UserLimitFeedback {
  name: string;
  phone: string;
  email: string;
  userNumber: string;

  constructor({ name, phone, email, userNumber }: UserLimitFeedback) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.userNumber = userNumber;
  }
}
