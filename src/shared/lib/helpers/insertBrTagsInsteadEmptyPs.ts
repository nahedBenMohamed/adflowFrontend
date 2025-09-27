const EMPTY_P_TAG_REGEX = /(<p\s?((style=")([a-zA-Z0-9:;.\s()\-,]*)("))?>)(<\/p>)/g;

export const insertBrTagsInsteadEmptyPs = (str: string): string => {
  return str.replaceAll(EMPTY_P_TAG_REGEX, '$1<br>$6');
};
