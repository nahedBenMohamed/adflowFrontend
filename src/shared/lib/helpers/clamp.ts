export const clamp = ({ min, val, max }: { min: number; val: number; max: number }) => {
  if (val < min) return min;
  else if (val > max) return max;
  else return val;
};
