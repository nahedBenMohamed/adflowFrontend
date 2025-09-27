export const removeFileExtensionFromName = (filename: string): string => {
  const regex = /\.[^/.]+$/u;

  return filename.replace(regex, '');
};
