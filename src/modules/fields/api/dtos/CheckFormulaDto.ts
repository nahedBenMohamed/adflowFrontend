export class CheckFormulaDto {
  entityTypeId: number;
  fieldId: number;
  formula: string;

  constructor({ entityTypeId, fieldId, formula }: CheckFormulaDto) {
    this.entityTypeId = entityTypeId;
    this.fieldId = fieldId;
    this.formula = formula;
  }
}
