import { type ContactInfoDto } from '@/app';
import { type Nullable } from '../../types';

export class ContactInfo {
  id: number;
  name: string;
  phone: Nullable<string[]>;
  email: Nullable<string>;

  constructor({
    id,
    name,
    phone,
    email,
  }: {
    id: number;
    name: string;
    phone: Nullable<string[]>;
    email: Nullable<string>;
  }) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
  }

  static fromDto(dto: ContactInfoDto): ContactInfo {
    return new ContactInfo({ ...dto });
  }
}
