export const extractFileExtensionFromType = (type: string): string => {
  const parts = type.split('/');

  const extension = parts[parts.length - 1];

  if (!extension) return '';

  if (extension.includes('vnd.openxmlformats-officedocument.wordprocessingml.document'))
    return 'docx';

  if (extension.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet')) return 'xlsx';

  if (extension.includes('vnd.openxmlformats-officedocument.presentationml.presentation'))
    return 'pptx';

  if (extension.includes('vnd.ms-word')) return 'doc';

  return extension.length > 0 ? extension : '';
};
