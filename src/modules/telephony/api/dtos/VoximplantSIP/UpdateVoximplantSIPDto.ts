import type { Nullable } from '@/shared';
import type { PbxProviderType } from '../../../shared';

export class UpdateVoximplantSIPDto {
  name?: string;
  proxy?: string;
  authUser?: string;
  password?: string;
  sipUsername?: string;
  type?: PbxProviderType;
  outboundProxy?: string;
  userIds?: Nullable<number[]>;

  constructor({
    type,
    name,
    proxy,
    authUser,
    password,
    sipUsername,
    outboundProxy,
    userIds,
  }: UpdateVoximplantSIPDto) {
    this.name = name;
    this.type = type;
    this.proxy = proxy;
    this.authUser = authUser;
    this.password = password;
    this.sipUsername = sipUsername;
    this.outboundProxy = outboundProxy;
    this.userIds = userIds;
  }
}
