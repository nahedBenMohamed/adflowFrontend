import type { Nullable, QueryParams } from '../types';

export class UrlUtil {
  static isValidUrl(urlString: string): boolean {
    /*
      1. ^: The symbol for the beginning of a string. This indicates that the match must start at the beginning of the string.

      2. (https?:\/\/)?: This part matches an optional URL part starting with "http://" or "https://". The s? makes the "s" optional, allowing for both "http" and "https".

      3. ([a-zA-Zа-яА-ЯёЁ0-9-]+\.)+: This group matches subdomains in the domain. It allows for letters (including Russian), numbers, and hyphens. The + after the group in parentheses indicates that it can repeat one or more times.

      4. ([a-zA-Zа-яА-ЯёЁ]{2,}): This group matches the top-level domain (TLD). It requires the TLD to contain at least two letters.

      5. (\/[^\s]*)?: This part matches an optional path after the domain. \/ corresponds to the "/" symbol, followed by any sequence of characters except spaces.

      6. $: The symbol for the end of a string. This indicates that the match must end at the end of the string.

      7. i: A modifier indicating case-insensitive comparison of characters.
    */

    // eslint-disable-next-line regexp/no-unused-capturing-group, regexp/no-obscure-range
    const urlPattern = /^(?:https?:\/\/)?(?:[a-zа-яё0-9-]+\.)+([a-zа-яё]{2,})(\/\S*)?$/i;

    return Boolean(urlPattern.test(urlString));
  }

  static getCurrentHostname(): string {
    return window.location.hostname;
  }

  static getCurrentPort(): string {
    return window.location.port;
  }

  static getProtocol(): string {
    return window.location.protocol;
  }

  static getBaseDomain(): string {
    const host = UrlUtil.getCurrentHostname();
    const parts = host.split('.');

    return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  }

  static isLocalhost3000(): boolean {
    return this.getCurrentHostname() === 'localhost' && this.getCurrentPort() === '3000';
  }

  static isLocalNetwork(): boolean {
    return (
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(this.getCurrentHostname()) &&
      this.getCurrentPort() === '3000'
    );
  }

  static getBaseDomainWithProtocol(): string {
    return `${this.getProtocol()}//${this.getBaseDomain()}`;
  }

  static clearURLQueryParams(): void {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  static getUrlFromText(inputStr: string): Nullable<string> {
    // ?? '' -> temporary solution to prevent from breaking when backend returns null as text/link field value
    // (this is not handled properly yet)
    const text = (inputStr || '').trim();

    if (!this.isValidUrl(text)) return null;

    if (text.startsWith('http')) {
      return text;
    } else {
      return `http://${text}`;
    }
  }

  static addOrReplaceQueryParams({
    url,
    queryParams,
  }: {
    url: string;
    queryParams: QueryParams;
  }): string {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;

    for (const key in queryParams) {
      const queryParam = queryParams[key];

      if (queryParam) searchParams.set(key, queryParam);
    }

    return String(urlObj);
  }

  static removeHttpProtocol(url: string): string {
    return url.replace(/^https?:\/\//, '');
  }
}
