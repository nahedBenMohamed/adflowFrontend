import type { UserTokenDto } from './UserTokenDto';

export interface UserAccessTokenDto {
  accessToken: string;
  userToken: UserTokenDto;
}
