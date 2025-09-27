import { UtcDate } from '../models';

export class JwtParserUtil {
  static parse(token: string): any {
    if (token === 'test-token') {
      return {
        exp: UtcDate.now().addMonths(1).timestamp,
      };
    }

    const base64Url = token.split('.')[1];

    if (!base64Url) {
      throw new Error(`Invalid jwt token, failed to parse base64Url, received: ${base64Url}}`);
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
