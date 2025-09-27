export const getDefaultEtColumnSize = ({
  windowWidth,
  fieldsCount,
  hasStage,
}: {
  windowWidth: number;
  fieldsCount: number;
  hasStage: boolean;
}): number => {
  const sidebarWidth = 61;
  const offset = 16;
  const systemFieldsCount = 2;
  const headerPadding = 8;
  const checkboxCell = 36;
  const resizerWidth = 5;

  const minDefaultColumnSize = 256;

  // main goal of this is to make table fit the screen if possible (calculated size is bigger than minDefaultColumnSize)
  const calculatedSize = Math.ceil(
    (windowWidth - sidebarWidth - offset * 2 - checkboxCell) /
      (fieldsCount + systemFieldsCount + (hasStage ? 1 : 0)) -
      headerPadding * 2 -
      resizerWidth
  );

  return calculatedSize >= minDefaultColumnSize ? calculatedSize : minDefaultColumnSize;
};
