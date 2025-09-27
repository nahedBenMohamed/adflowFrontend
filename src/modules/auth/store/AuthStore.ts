import { appStore, baseApi, userApi } from '@/app';
import { partnerApi } from '@/modules/partner';
import {
  CommonQueryParams,
  GTMUtil,
  JwtParserUtil,
  TokenUtil,
  UriCodingUtil,
  UrlUtil,
  UtcDate,
  envUtil,
  type JwtToken,
  type Nullable,
  type User,
} from '@/shared';
import { HttpStatusCode, type AxiosError } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { authApi } from '../api';

class AuthStore {
  accountId: Nullable<number> = null;
  user: Nullable<User> = null;

  isAuthenticated = false;
  isLoading = true;

  constructor() {
    makeAutoObservable(this);
  }

  isAdmin = (): boolean => {
    return this.user ? this.user.isAdmin() : false;
  };

  startAuth = async (): Promise<void> => {
    this.isLoading = true;

    // first, we're trying to get the jwt token from the local storage
    let token = TokenUtil.getLocalToken();

    // else, we're trying to get it from the query string, this is the case
    // when we're logging from no subdomain to specific subdomain
    const searchParams = new URLSearchParams(window.location.search);
    const tokenFromSearch = searchParams.get(CommonQueryParams.TOKEN);

    if (!token) token = tokenFromSearch ? UriCodingUtil.decode(tokenFromSearch) : null;

    if (tokenFromSearch) {
      searchParams.delete(CommonQueryParams.TOKEN);

      // if token exists in search – clear the "token" param, but keep other params
      window.history.replaceState(
        null,
        '',
        searchParams.size > 0
          ? `${window.location.pathname}?${searchParams.toString()}`
          : window.location.pathname
      );
    }

    // if we don't have any token, we need to reset auth
    if (!token) {
      this.resetAuthorization();

      return;
    }

    try {
      const payload = JwtParserUtil.parse(token);

      if (UtcDate.fromTimestamp(payload['exp']).isExpired()) {
        this.resetAuthorization();

        return;
      }
    } catch (e) {
      this.resetAuthorization();

      throw new Error(`Invalid jwt token, failed to authenticate: ${e}`);
    }

    try {
      const jwtToken = await authApi.refreshToken(token);

      await this.setupAuthorization(jwtToken);
    } catch (e: unknown) {
      const error = e as AxiosError;

      if (
        error.isAxiosError &&
        error.response &&
        error.response.status === HttpStatusCode.Unauthorized
      )
        this.resetAuthorization();

      throw new Error(`Failed to refresh jwt token: ${e}`);
    } finally {
      this.isLoading = false;
    }
  };

  setupAuthorization = async (jwtToken: JwtToken): Promise<void> => {
    TokenUtil.updateJwtToken(jwtToken);

    baseApi.setAuthToken(jwtToken.token);

    await runInAction(async (): Promise<void> => {
      this.accountId = jwtToken.accountId;

      this.user = jwtToken.isPartner
        ? await partnerApi.getPartnerUser(jwtToken.userId)
        : await userApi.getUserById(jwtToken.userId);

      this.isAuthenticated = Boolean(this.user);

      if (this.user && !jwtToken.isPartner) {
        GTMUtil.setupDataLayer(this.accountId, this.user.id, this.user.analyticsId);

        appStore.load();
      }
    });
  };

  resetAuthorization = (): void => {
    TokenUtil.resetJwtToken();

    this.isAuthenticated = false;
    this.isLoading = false;

    this.user = null;
    this.accountId = null;

    appStore.reset();
  };

  decodeLoginLink = async (loginLink: string): Promise<void> => {
    const jwtToken = await authApi.decodeLoginLink(loginLink);

    await this.setupAuthorization(jwtToken);
  };

  logout = (): void => {
    this.resetAuthorization();
  };

  login = async ({
    email,
    redirectPath,
    password,
    searchParams,
  }: {
    email: string;
    // path to redirect to after login
    redirectPath: Nullable<string>;
    password: string;
    searchParams: string;
  }): Promise<Nullable<string>> => {
    try {
      const jwtToken = await authApi.login({ email, password });

      return jwtToken ? this.getRedirectUrl({ jwtToken, redirectPath, searchParams }) : null;
    } catch (e) {
      const jwtToken = await partnerApi.login({ email, password });

      return jwtToken ? this.getRedirectUrl({ jwtToken, redirectPath, searchParams }) : null;
    }
  };

  invalidateCurrentUserInCache = async (): Promise<void> => {
    if (!this.user) return;

    try {
      this.user = await userApi.getUserById(this.user.id);
    } catch (e) {
      throw new Error(`Failed to invalidate current user in AuthStore cache: ${e}`);
    }
  };

  uploadUserAvatar = async ({ userId, blob }: { userId: number; blob: Blob }): Promise<void> => {
    const formData = new FormData();
    formData.append('avatar', blob, 'avatar.jpg');

    this.user = await userApi.uploadUserAvatar({ userId, formData });
  };

  removeUserAvatar = async (userId: number): Promise<void> => {
    this.user = await userApi.removeUserAvatar(userId);
  };

  private getRedirectUrl = ({
    jwtToken,
    redirectPath,
    searchParams,
  }: {
    jwtToken: JwtToken;
    redirectPath: Nullable<string>;
    searchParams: string;
  }): string => {
    const { subdomain } = jwtToken;

    // app url template must be in http://{subdomain}.amwork.loc:3000 format (must include {subdomain})
    let redirectUrl = envUtil.appUrlTemplate.replace('{subdomain}', subdomain);

    if (redirectPath) redirectUrl = `${redirectUrl}${redirectPath}`;

    // if we're on localhost:3000 – local testing scenario
    if (UrlUtil.isLocalhost3000()) redirectUrl = 'http://localhost:3000';

    // if we're on local network
    if (UrlUtil.isLocalNetwork()) redirectUrl = `http://${UrlUtil.getCurrentHostname()}:3000`;

    // redirectUrl + old searchParams + token
    return `${redirectUrl}${searchParams ? `?${searchParams}` : ''}${searchParams ? '&' : '?'}${CommonQueryParams.TOKEN}=${UriCodingUtil.encode(
      jwtToken.token
    )}`;
  };
}

export const authStore = new AuthStore();
