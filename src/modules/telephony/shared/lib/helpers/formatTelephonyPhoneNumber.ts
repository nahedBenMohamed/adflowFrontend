import parsePhoneNumberFromString from 'libphonenumber-js';

// we can get either a valid international phone number or a random string,
// voximplant does not use local numbers
export const formatTelephonyPhoneNumber = (number: string): string => {
  let parsedNumber = parsePhoneNumberFromString(number);

  if (!parsedNumber) parsedNumber = parsePhoneNumberFromString(`+${number}`);

  if (parsedNumber) {
    return parsedNumber.formatInternational();
  } else {
    // return unformatted number if parsing fails
    return number;
  }
};
