export const getDefaultProductsColumnSize = ({
  windowWidth,
  columnsCount,
}: {
  windowWidth: number;
  columnsCount: number;
}): number => {
  const offset = 24;
  const sidebarWidth = 61;
  const headerPadding = 8;

  return Math.ceil((windowWidth - sidebarWidth - offset * 2) / columnsCount - headerPadding * 2);
};
