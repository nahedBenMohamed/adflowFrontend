import { type JwtToken } from '../models';
import { type Nullable } from '../types';

export class TokenUtil {
  private static _storageKeys = {
    token: 'token',
    userId: 'userId',
    accountId: 'accountId',
  };

  static getLocalToken = (): Nullable<string> => {
    return localStorage.getItem(this._storageKeys.token);
  };

  static getUserId = (): Nullable<string> => {
    return localStorage.getItem(this._storageKeys.userId);
  };

  static updateJwtToken = (jwtToken: JwtToken): void => {
    localStorage.setItem(this._storageKeys.token, jwtToken.token);
    localStorage.setItem(this._storageKeys.userId, String(jwtToken.userId));
    localStorage.setItem(this._storageKeys.accountId, String(jwtToken.accountId));
  };

  static resetJwtToken = (): void => {
    localStorage.removeItem(this._storageKeys.token);
    localStorage.removeItem(this._storageKeys.userId);
    localStorage.removeItem(this._storageKeys.accountId);
  };
}
