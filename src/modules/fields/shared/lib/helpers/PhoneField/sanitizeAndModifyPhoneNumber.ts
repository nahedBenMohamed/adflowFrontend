export const sanitizeAndModifyPhoneNumber = ({
  phoneNumber,
  isRULocale,
}: {
  phoneNumber: string;
  isRULocale: boolean;
}): string => {
  if (isRULocale && phoneNumber[0] === '8') phoneNumber = '+7' + phoneNumber.slice(1);

  return phoneNumber.replace(/[^0-9+]/g, '');
};
