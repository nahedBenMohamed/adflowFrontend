export const shortenQuickNoteTitle = (title: string): string => {
  const titleElements = title.split('|');

  return titleElements.slice(0, titleElements.length - 1).join('|');
};
