import type { FormulaFieldMathElement } from '../../models';

export type AppendMathElementHandler = (
  element: Omit<FormulaFieldMathElement, 'sortOrder' | 'label'>
) => void;
