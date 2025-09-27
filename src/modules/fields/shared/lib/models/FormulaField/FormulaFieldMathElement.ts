import type { FormulaFieldMathElementType } from './FormulaFieldMathElementType';

export interface FormulaFieldMathElement {
  label: string;
  value: string;
  sortOrder: number;
  type: FormulaFieldMathElementType;
}
