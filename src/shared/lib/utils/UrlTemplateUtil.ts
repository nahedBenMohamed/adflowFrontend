import { compile } from 'path-to-regexp';

export class UrlTemplateUtil {
  static toPath(template: string, params: object): string {
    const toPath = compile(template, { encode: encodeURIComponent });

    const sanitizedParams = Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );

    return toPath(sanitizedParams);
  }
}
