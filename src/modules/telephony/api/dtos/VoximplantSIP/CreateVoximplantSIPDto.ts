import type { Nullable } from '@/shared';
import type { PbxProviderType } from '../../../shared';

export class CreateVoximplantSIPDto {
  name: string;
  proxy: string;
  sipUsername: string;
  type: PbxProviderType;
  authUser?: string;
  password?: string;
  outboundProxy?: string;
  userIds?: Nullable<number[]>;

  constructor({
    name,
    proxy,
    authUser,
    password,
    sipUsername,
    type,
    outboundProxy,
    userIds,
  }: CreateVoximplantSIPDto) {
    this.name = name;
    this.proxy = proxy;
    this.authUser = authUser;
    this.password = password;
    this.sipUsername = sipUsername;
    this.type = type;
    this.outboundProxy = outboundProxy;
    this.userIds = userIds;
  }
}
