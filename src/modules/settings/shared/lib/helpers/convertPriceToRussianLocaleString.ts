import { Gender, numeralize } from 'numeralize-ru';

export const convertPriceToRussianLocaleString = (num: number): string => {
  const rubles = Math.floor(num);
  const kopecks = Math.round((num - rubles) * 100);

  // Determine the correct declension for "рубль" (rubles)
  const rublesWord =
    rubles % 10 === 1 && rubles % 100 !== 11
      ? 'рубль'
      : rubles % 10 >= 2 && rubles % 10 <= 4 && (rubles % 100 < 10 || rubles % 100 >= 20)
        ? 'рубля'
        : 'рублей';

  // Convert rubles to a string with the appropriate declension
  let rublesPart = `${numeralize(rubles, Gender.Masculine)} ${rublesWord}`;

  // Make first word start from a capital letter
  rublesPart = rublesPart.charAt(0).toUpperCase() + rublesPart.slice(1);

  // Format kopecks, adding a leading zero if necessary
  const kopecksPart = `${String(kopecks).padStart(2, '0')} коп.`;

  return `${rublesPart} ${kopecksPart}`;
};
