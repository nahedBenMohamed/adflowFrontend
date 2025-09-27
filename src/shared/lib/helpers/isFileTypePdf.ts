export const isFileTypePdf = (fileType: string): boolean =>
  ['application/pdf', 'application/x-pdf', 'application/x-bzpdf'].includes(fileType);
