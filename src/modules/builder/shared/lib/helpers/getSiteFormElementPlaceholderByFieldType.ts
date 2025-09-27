import { FieldType } from '@/shared';

export const getSiteFormElementPlaceholderByFieldType = ({
  fieldType,
  fallback,
}: {
  fieldType: string;
  fallback: string;
}) => {
  switch (fieldType) {
    case FieldType.EMAIL:
      return 'forexample@mail.com';

    case FieldType.PHONE:
      return '+__ (___) ___-__-__';

    case FieldType.LINK:
      return 'https://example.com';

    default:
      return fallback;
  }
};
