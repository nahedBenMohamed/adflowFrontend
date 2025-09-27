import { type Nullable, type Optional } from '../types';

type TextContrastColor =
  | 'var(--button-text-graphite-priory-text)'
  | 'var(--primary-statuses-white-0)';

interface PipelineColorsMapObject {
  bgColorVar: string;
  bgColorHex: string;
  bgColorRgb: string;
  textColor: TextContrastColor;
}

const pipelineColorsTextContrastMap: PipelineColorsMapObject[] = [
  {
    bgColorVar: 'var(--primary-statuses-red-360)',
    bgColorHex: '#f8654f',
    bgColorRgb: '248, 101, 79',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-orange-440)',
    bgColorHex: '#f68828',
    bgColorRgb: '246, 136, 40',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-yellow-400)',
    bgColorHex: '#fbd437',
    bgColorRgb: '251, 212, 55',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--primary-statuses-salad-480)',
    bgColorHex: '#b0e228',
    bgColorRgb: '176, 226, 40',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--primary-statuses-green-520)',
    bgColorHex: '#69d222',
    bgColorRgb: '105, 210, 34',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--primary-statuses-malachite-480)',
    bgColorHex: '#23e664',
    bgColorRgb: '35, 230, 100',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--primary-statuses-aquamarine-480)',
    bgColorHex: '#23e7b2',
    bgColorRgb: '35, 231, 178',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--primary-statuses-turquoise-520)',
    bgColorHex: '#1dd7d7',
    bgColorRgb: '29, 215, 215',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--primary-statuses-noun-440)',
    bgColorHex: '#2cbdf2',
    bgColorRgb: '44, 189, 242',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-blue-360)',
    bgColorHex: '#5293f4',
    bgColorRgb: '82, 147, 244',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-purple-360)',
    bgColorHex: '#7e70d7',
    bgColorRgb: '126, 112, 215',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-amethyst-360)',
    bgColorHex: '#a770d7',
    bgColorRgb: '167, 112, 215',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-fuchsia-400)',
    bgColorHex: '#cb60d2',
    bgColorRgb: '203, 96, 210',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-crimson-360)',
    bgColorHex: '#e561b9',
    bgColorRgb: '229, 97, 185',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--primary-statuses-pink-360)',
    bgColorHex: '#f45288',
    bgColorRgb: '244, 82, 136',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--secondary-red-240)',
    bgColorHex: '#fa9989',
    bgColorRgb: '250, 153, 137',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-orange-240)',
    bgColorHex: '#fabe89',
    bgColorRgb: '250, 190, 137',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-yellow-240)',
    bgColorHex: '#fde587',
    bgColorRgb: '253, 229, 135',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-salad-280)',
    bgColorHex: '#d1ee81',
    bgColorRgb: '209, 238, 129',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-green-280)',
    bgColorHex: '#adee81',
    bgColorRgb: '173, 238, 129',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-malachite-240)',
    bgColorHex: '#91f3b1',
    bgColorRgb: '145, 243, 177',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-aquamarine-240)',
    bgColorHex: '#91f3d9',
    bgColorRgb: '145, 243, 217',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-turquoise-240)',
    bgColorHex: '#93f0f0',
    bgColorRgb: '147, 240, 240',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-noun-240)',
    bgColorHex: '#8cdbf8',
    bgColorRgb: '140, 219, 248',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-blue-240)',
    bgColorHex: '#8cb7f8',
    bgColorRgb: '140, 183, 248',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-purple-200)',
    bgColorHex: '#b1a7f1',
    bgColorRgb: '177, 167, 241',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-amethyst-200)',
    bgColorHex: '#ceafe9',
    bgColorRgb: '206, 175, 233',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-fuchsia-200)',
    bgColorHex: '#e3b1e7',
    bgColorRgb: '227, 177, 231',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--secondary-crimson-200)',
    bgColorHex: '#f3a5d9',
    bgColorRgb: '243, 165, 217',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--secondary-pink-200)',
    bgColorHex: '#f99fbd',
    bgColorRgb: '249, 159, 189',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--neutral-red-100)',
    bgColorHex: '#fdd4ce',
    bgColorRgb: '253, 212, 206',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--neutral-orange-80)',
    bgColorHex: '#fde9d8',
    bgColorRgb: '253, 233, 216',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--neutral-yellow-80)',
    bgColorHex: '#fef6d7',
    bgColorRgb: '254, 246, 215',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--graphite-graphite-200)',
    bgColorHex: '#c4cad4',
    bgColorRgb: '196, 202, 212',
    textColor: 'var(--button-text-graphite-priory-text)',
  },
  {
    bgColorVar: 'var(--graphite-graphite-680)',
    bgColorHex: '#454f5e',
    bgColorRgb: '69, 79, 94)',
    textColor: 'var(--primary-statuses-white-0)',
  },
  {
    bgColorVar: 'var(--button-text-graphite-priory-text)',
    bgColorHex: '#454f5e',
    bgColorRgb: '69, 79, 94',
    textColor: 'var(--primary-statuses-white-0)',
  },
];

export class ColorUtil {
  static colors: string[] = [
    'var(--primary-statuses-red-360)',
    'var(--primary-statuses-orange-440)',
    'var(--primary-statuses-yellow-400)',
    'var(--primary-statuses-salad-480)',
    'var(--primary-statuses-green-520)',
    'var(--primary-statuses-malachite-480)',
    'var(--primary-statuses-aquamarine-480)',
    'var(--primary-statuses-turquoise-520)',
    'var(--primary-statuses-noun-440)',
    'var(--primary-statuses-blue-360)',
    'var(--primary-statuses-purple-360)',
    'var(--primary-statuses-amethyst-360)',
    'var(--primary-statuses-fuchsia-400)',
    'var(--primary-statuses-crimson-360)',
    'var(--primary-statuses-pink-360)',
    'var(--secondary-red-240)',
    'var(--secondary-orange-240)',
    'var(--secondary-yellow-240)',
    'var(--secondary-salad-280)',
    'var(--secondary-green-280)',
    'var(--secondary-malachite-240)',
    'var(--secondary-aquamarine-240)',
    'var(--secondary-turquoise-240)',
    'var(--secondary-noun-240)',
    'var(--secondary-blue-240)',
    'var(--secondary-purple-200)',
    'var(--secondary-amethyst-200)',
    'var(--secondary-fuchsia-200)',
    'var(--secondary-crimson-200)',
    'var(--secondary-pink-200)',
    'var(--neutral-red-100)',
    'var(--neutral-orange-80)',
    'var(--neutral-yellow-80)',
    'var(--graphite-graphite-200)',
    'var(--graphite-graphite-680)',
    'var(--button-text-graphite-priory-text)',
  ];

  static getDefaultBgColor(): string {
    return 'var(--neutral-noun-80)';
  }

  static getDefaultTextContrastColor(): TextContrastColor {
    return 'var(--button-text-graphite-priory-text)';
  }

  static findPipelineVar(pipelineVar: string): Optional<PipelineColorsMapObject> {
    let color = pipelineVar;
    if (pipelineVar.includes('pipeline')) color = this.convertPipelineVarToStatusesVar(pipelineVar);

    return pipelineColorsTextContrastMap.find(c => c.bgColorVar === color);
  }

  static getBgColorHexByPipelineVar(pipelineVar: string): string {
    const mapObject = this.findPipelineVar(pipelineVar);

    if (mapObject) return mapObject.bgColorHex;

    return this.getDefaultBgColor();
  }

  static getBgColorRgbByPipelineVar(pipelineVar: string): string {
    const mapObject = this.findPipelineVar(pipelineVar);

    if (mapObject) return mapObject.bgColorRgb;

    return this.getDefaultBgColor();
  }

  static calculateYiqContrast(r: number, g: number, b: number): number {
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  static getTextContrastColorByVar(colorVar: string): TextContrastColor {
    const mapObject = this.findPipelineVar(colorVar);

    if (mapObject) return mapObject.textColor;

    return this.getDefaultTextContrastColor();
  }

  static getRgbYiqContrast(colorRgb: string): number {
    const rgb = colorRgb.replace('rgb(', '').replace(')', '').split(',');

    const rStr = rgb[0];
    const gStr = rgb[1];
    const bStr = rgb[2];

    if (!rStr || !gStr || !bStr)
      throw new Error(`Failed to parse rgb color, received: ${colorRgb}`);

    const r = Number(rStr);
    const g = Number(gStr);
    const b = Number(bStr);

    return this.calculateYiqContrast(r, g, b);
  }

  static getHexYiqContrast(colorHex: string): number {
    // if a leading # is provided, remove it
    if (colorHex.slice(0, 1) === '#') {
      colorHex = colorHex.slice(1);
    }

    // if a three-character hexcode, make six-character
    if (colorHex.length === 3) {
      colorHex = colorHex
        .split('')
        .map(hex => hex + hex)
        .join('');
    }

    const r = parseInt(colorHex.substring(0, 2), 16);
    const g = parseInt(colorHex.substring(2, 4), 16);
    const b = parseInt(colorHex.substring(4, 6), 16);

    return this.calculateYiqContrast(r, g, b);
  }

  static getTextContrastColorByBgColorHex(bgColor: Nullable<string>): TextContrastColor {
    if (!bgColor) return 'var(--button-text-graphite-priory-text)';

    if (bgColor.includes('var')) return this.getTextContrastColorByVar(bgColor);

    let yiq;

    if (bgColor.includes('rgb')) {
      yiq = this.getRgbYiqContrast(bgColor);
    } else {
      yiq = this.getHexYiqContrast(bgColor);
    }

    return yiq >= 128
      ? 'var(--button-text-graphite-priory-text)'
      : 'var(--primary-statuses-white-0)';
  }

  static getProcessedBGColor(bgColor: Nullable<string>): string {
    if (!bgColor) return 'var(--button-text-graphite-priory-text)';

    if (bgColor.includes('pipeline')) return this.convertPipelineVarToStatusesVar(bgColor);

    if (bgColor === 'var(--black-primary)') return 'var(--button-text-graphite-priory-text)';

    return bgColor;
  }

  static convertPipelineVarToStatusesVar(pipelineVar: string): string {
    const pipelineVarIdx = Number(pipelineVar.replace(/\D/g, '')) - 1;
    const color = ColorUtil.colors[pipelineVarIdx];

    return color ?? 'var(--neutral-noun-80)';
  }
}
