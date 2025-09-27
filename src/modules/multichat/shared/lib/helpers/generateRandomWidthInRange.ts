import type { CSSProperties } from 'react';

interface Options {
  min: number;
  max: number;
}

export const generateRandomWidthInRange = (options: Options): CSSProperties['width'] => {
  const { min, max } = options;

  return `${Math.floor(Math.random() * (max - min + 1)) + min}px`;
};
