import { type EntityInfoDto } from '@/app';
import { type Nullable } from '../../types';
import { type ContactInfo } from './ContactInfo';

export class EntityInfo {
  id: number;
  name: string;
  entityTypeId: number;
  hasAccess: boolean;
  contact: Nullable<ContactInfo>;

  constructor({
    id,
    name,
    entityTypeId,
    hasAccess,
    contact,
  }: {
    id: number;
    name: string;
    entityTypeId: number;
    hasAccess: boolean;
    contact: Nullable<ContactInfo>;
  }) {
    this.id = id;
    this.name = name;
    this.entityTypeId = entityTypeId;
    this.hasAccess = hasAccess;
    this.contact = contact;
  }

  static fromDto(dto: EntityInfoDto): EntityInfo {
    return new EntityInfo({ ...dto });
  }
}
