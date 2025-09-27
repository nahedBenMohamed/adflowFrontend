import type { Option } from '../models';
import { ColorUtil } from '../utils';

export const generateMockOptions = (count: number): Option<number, { bgColor: string }>[] =>
  new Array(count).fill(0).map((_, idx) => {
    const bgColor = ColorUtil.colors[idx] ?? ColorUtil.getDefaultBgColor();

    return {
      value: idx,
      label: `Option ${idx}`,
      extra: { bgColor },
    };
  });
