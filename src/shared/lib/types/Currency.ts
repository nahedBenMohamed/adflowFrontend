export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  CNY = 'CNY',
  INR = 'INR',
  RUB = 'RUB',
  MXN = 'MXN',
  BRL = 'BRL',
  ZAR = 'ZAR',
  AUD = 'AUD',
  CAD = 'CAD',
  AED = 'AED',
  CHF = 'CHF',
  TRY = 'TRY',
  UAH = 'UAH',
  KRW = 'KRW',
  NZD = 'NZD',
  NOK = 'NOK',
  SEK = 'SEK',
  DKK = 'DKK',
  PLN = 'PLN',
  CZK = 'CZK',
  HUF = 'HUF',
  IDR = 'IDR',
  ILS = 'ILS',
  MYR = 'MYR',
  PHP = 'PHP',
  SGD = 'SGD',
  THB = 'THB',
  KZT = 'KZT',
  CLP = 'CLP',
  CRC = 'CRC',
  COP = 'COP',
  BOB = 'BOB',
  HKD = 'HKD',
  SAR = 'SAR',
  VND = 'VND',
  EGP = 'EGP',
  KWD = 'KWD',
  PKR = 'PKR',
  LKR = 'LKR',
  BDT = 'BDT',
  NGN = 'NGN',
  GHS = 'GHS',
  TWD = 'TWD',
  MAD = 'MAD',
  ARS = 'ARS',
  PEN = 'PEN',
  UYU = 'UYU',
  BGN = 'BGN',
  RON = 'RON',
  LBP = 'LBP',
}

interface CurrencyWithLocale {
  currency: Currency;
  locale: string;
}

export const currenciesWithLocales: CurrencyWithLocale[] = [
  {
    currency: Currency.USD,
    locale: 'en-US',
  },
  {
    currency: Currency.EUR,
    locale: 'en-DE',
  },
  {
    currency: Currency.GBP,
    locale: 'en-GB',
  },
  {
    currency: Currency.JPY,
    locale: 'ja-JP',
  },
  {
    currency: Currency.CNY,
    locale: 'zh-CN',
  },
  {
    currency: Currency.INR,
    locale: 'en-IN',
  },
  {
    currency: Currency.RUB,
    locale: 'ru-RU',
  },
  {
    currency: Currency.MXN,
    locale: 'es-MX',
  },
  {
    currency: Currency.BRL,
    locale: 'pt-BR',
  },
  {
    currency: Currency.ZAR,
    locale: 'en-ZA',
  },
  {
    currency: Currency.AUD,
    locale: 'en-AU',
  },
  {
    currency: Currency.CAD,
    locale: 'en-CA',
  },
  {
    currency: Currency.AED,
    locale: 'ar-AE',
  },
  {
    currency: Currency.CHF,
    locale: 'de-CH',
  },
  {
    currency: Currency.TRY,
    locale: 'tr-TR',
  },
  {
    currency: Currency.UAH,
    locale: 'uk-UA',
  },
  {
    currency: Currency.KRW,
    locale: 'ko-KR',
  },
  {
    currency: Currency.NZD,
    locale: 'en-NZ',
  },
  {
    currency: Currency.NOK,
    locale: 'nb-NO',
  },
  {
    currency: Currency.SEK,
    locale: 'sv-SE',
  },
  {
    currency: Currency.DKK,
    locale: 'da-DK',
  },
  {
    currency: Currency.PLN,
    locale: 'pl-PL',
  },
  {
    currency: Currency.CZK,
    locale: 'cs-CZ',
  },
  {
    currency: Currency.HUF,
    locale: 'hu-HU',
  },
  {
    currency: Currency.IDR,
    locale: 'id-ID',
  },
  {
    currency: Currency.ILS,
    locale: 'he-IL',
  },
  {
    currency: Currency.MYR,
    locale: 'ms-MY',
  },
  {
    currency: Currency.PHP,
    locale: 'fil-PH',
  },
  {
    currency: Currency.SGD,
    locale: 'en-SG',
  },
  {
    currency: Currency.THB,
    locale: 'th-TH',
  },
  {
    currency: Currency.KZT,
    locale: 'kk-KZ',
  },
  {
    currency: Currency.CLP,
    locale: 'es-CL',
  },
  {
    currency: Currency.CRC,
    locale: 'es-CR',
  },
  {
    currency: Currency.COP,
    locale: 'es-CO',
  },
  {
    currency: Currency.BOB,
    locale: 'es-BO',
  },
  {
    currency: Currency.HKD,
    locale: 'zh-HK',
  },
  {
    currency: Currency.SAR,
    locale: 'ar-SA',
  },
  {
    currency: Currency.VND,
    locale: 'vi-VN',
  },
  {
    currency: Currency.EGP,
    locale: 'ar-EG',
  },
  {
    currency: Currency.KWD,
    locale: 'ar-KW',
  },
  {
    currency: Currency.PKR,
    locale: 'ur-PK',
  },
  {
    currency: Currency.LKR,
    locale: 'si-LK',
  },
  {
    currency: Currency.BDT,
    locale: 'bn-BD',
  },
  {
    currency: Currency.NGN,
    locale: 'en-NG',
  },
  {
    currency: Currency.GHS,
    locale: 'ak-GH',
  },
  {
    currency: Currency.TWD,
    locale: 'zh-TW',
  },
  {
    currency: Currency.MAD,
    locale: 'ar-MA',
  },
  {
    currency: Currency.ARS,
    locale: 'es-AR',
  },
  {
    currency: Currency.PEN,
    locale: 'es-PE',
  },
  {
    currency: Currency.UYU,
    locale: 'es-UY',
  },
  {
    currency: Currency.BGN,
    locale: 'bg-BG',
  },
  {
    currency: Currency.RON,
    locale: 'ro-RO',
  },
  {
    currency: Currency.LBP,
    locale: 'ar-LB',
  },
];
