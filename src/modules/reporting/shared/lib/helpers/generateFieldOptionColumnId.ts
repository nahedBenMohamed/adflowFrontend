export const generateFieldOptionColumnId = ({
  fieldId,
  optionId,
}: {
  fieldId: number;
  optionId: number;
}): string => `${fieldId}_${optionId}`;

export const extractOptionIdFromColumnId = (columnId: string): number => {
  const candidate = columnId.split('_')[1];

  if (!candidate)
    throw new Error(
      `Failed to extract option id from column id ${columnId}, it was generated with wrong column id format`
    );

  return Number(candidate);
};
