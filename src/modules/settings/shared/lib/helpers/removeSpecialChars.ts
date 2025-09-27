export const removeSpecialChars = (input: string): string => {
  // This regex pattern will match any character that is NOT a letter or number, considering Unicode character properties
  const regex = /[^\p{L}\p{N}]/gu;
  const filteredString = input.replace(regex, '');

  return filteredString;
};
