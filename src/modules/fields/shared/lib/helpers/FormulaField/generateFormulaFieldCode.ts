export const generateFormulaFieldCode = ({
  entityTypeId,
  fieldId,
}: {
  entityTypeId: number;
  fieldId: number;
}): string => `et${entityTypeId}_f${fieldId}`;
