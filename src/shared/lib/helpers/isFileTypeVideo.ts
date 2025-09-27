export const isFileTypeVideo = (fileType: string): boolean =>
  ['video/mp4', 'video/x-m4v', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'].includes(
    fileType
  );
