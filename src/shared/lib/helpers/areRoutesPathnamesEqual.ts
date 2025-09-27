// we are not counting the search params in the pathname
export const areRoutesPathnamesEqual = ({ p1, p2 }: { p1: string; p2: string }): boolean => {
  const pathnameWithoutSearch = p1.split('?')[0];
  const hrefWithoutSearch = p2.split('?')[0];

  return pathnameWithoutSearch === hrefWithoutSearch;
};
