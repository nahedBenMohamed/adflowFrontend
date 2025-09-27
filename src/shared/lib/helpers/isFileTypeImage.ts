export const isFileTypeImage = (fileType: string): boolean =>
  ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/bmp', 'image/webp'].includes(
    fileType
  );
