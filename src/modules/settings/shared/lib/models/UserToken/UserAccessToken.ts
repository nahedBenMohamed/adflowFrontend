import type { UserAccessTokenDto } from '../../../../api';
import { UserToken } from './UserToken';

export class UserAccessToken {
  accessToken: string;
  userToken: UserToken;

  constructor({ accessToken, userToken }: UserAccessToken) {
    this.accessToken = accessToken;
    this.userToken = userToken;
  }

  static fromDto(dto: UserAccessTokenDto): UserAccessToken {
    return new UserAccessToken({
      accessToken: dto.accessToken,
      userToken: UserToken.fromDto(dto.userToken),
    });
  }
}
