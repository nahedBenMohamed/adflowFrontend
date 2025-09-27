/** You should have an array with three options of words or expressions, where
 * the first is applied to number ending in 1,
 * the second is applied to number ending in 2, 3 or 4,
 * the third is applied to number ending in 0, 5, 6, 7, 8, 9
 * for example ['символ', 'символа', 'символов'].
 * Create an array for each locale.
 * This helper returns the index of the array depending on the value.
 */

export const calculateEndOfWordIdxByNumber = (value: number): number => {
  const cases = [2, 0, 1, 1, 1, 2];

  const idx = value % 100 > 4 && value % 100 < 20 ? 2 : cases[value % 10 < 5 ? value % 10 : 5];

  return idx ?? 2;
};
