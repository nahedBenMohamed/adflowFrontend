const BR_TAG_REGEX = /(<p\s?((style=")([a-zA-Z0-9:;.\s()\-,]*)("))?>)<br>(<\/p>)/g;

export const removeBrTagsFromStr = (str: string): string => {
  return str.replaceAll(BR_TAG_REGEX, '$1$6');
};
