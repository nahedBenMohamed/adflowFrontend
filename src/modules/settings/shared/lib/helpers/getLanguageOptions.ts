import { Language, envUtil, type Option } from '@/shared';

export const getLanguageOptions = (): Option<Language>[] => {
  const options = [
    { value: Language.ENGLISH, label: 'English' },
    { value: Language.FRENCH, label: 'Français' },
    { value: Language.RUSSIAN, label: 'Русский' },
    { value: Language.POLISH, label: 'Polski' },
    { value: Language.SPANISH, label: 'Español' },
  ];

  return options.filter(o => envUtil.appLanguages.includes(o.value));
};
