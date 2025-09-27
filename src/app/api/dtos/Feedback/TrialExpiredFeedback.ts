export class TrialExpiredFeedback {
  name: string;
  phone: string;
  email: string;
  userNumber: string;
  subscribe: string;
  plan: string;

  constructor({ name, phone, email, userNumber, subscribe, plan }: TrialExpiredFeedback) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.userNumber = userNumber;
    this.subscribe = subscribe;
    this.plan = plan;
  }
}
