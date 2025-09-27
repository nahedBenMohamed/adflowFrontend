// https://github.com/missive/emoji-mart

interface EmojiMartData {
  id: string;
  emoticons: string[];
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
}

declare module '@emoji-mart/react' {
  import { type FC } from 'react';

  type PickerLocale =
    | 'en'
    | 'ar'
    | 'be'
    | 'cs'
    | 'de'
    | 'es'
    | 'fa'
    | 'fi'
    | 'fr'
    | 'hi'
    | 'it'
    | 'ja'
    | 'kr'
    | 'nl'
    | 'pl'
    | 'pt'
    | 'ru'
    | 'sa'
    | 'tr'
    | 'uk'
    | 'vi'
    | 'zh';

  interface EmojiProps {
    emoji: string;
    size?: number;
    set?: string;
    skin?: number;
    sheetSize?: number;
  }

  interface PickerProps {
    emojiSize?: number;
    perLine?: number;
    i18n?: {
      categories: {
        [key: string]: string;
      };
      notfound: string;
      search: string;
      skintext: string;
      categorieslabel: string;
      skintones: {
        [key: string]: string;
      };
    };
    custom?: Array<string | EmojiData>;
    recent?: string[];
    autoFocus?: boolean;
    style?: Record<string, string | number>;
    theme?: 'auto' | 'dark' | 'light';
    title?: string;
    color?: string;
    native?: boolean;
    include?: string[];
    exclude?: string[];
    data?: EmojiMartData[];
    previewPosition?: 'top' | 'bottom' | 'none';
    emojiButtonColors?: string[];
    locale: PickerLocale | string;
    onEmojiSelect: (emoji: EmojiMartData) => void;
  }

  const Picker: FC<PickerProps>;

  export default Picker;
  export const Emoji: FC<EmojiProps>;
}

declare module '@emoji-mart/data' {
  const data: EmojiMartData[];

  export default data;
}
