import type { Nullable } from '@/shared';

export class SendContactUsFormDto {
  name: string;
  phone: string;
  email: string;
  comment: Nullable<string>;
  ref: Nullable<string>;

  constructor({ name, phone, email, comment, ref }: SendContactUsFormDto) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.comment = comment;
    this.ref = ref;
  }
}
