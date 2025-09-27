export class MathUtil {
  static maxOrZero(numbers: number[]): number {
    let max = 0;

    for (const number of numbers) {
      if (number > max) max = number;
    }

    return max;
  }

  static minOrZero(numbers: number[]): number {
    let min = 0;

    for (const number of numbers) {
      if (number < min) min = number;
    }

    return min;
  }
}
