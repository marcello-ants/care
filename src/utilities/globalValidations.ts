// this allows 5 digits
export const validZipCodeRegex = new RegExp('^\\d{5}$');
// this allows a partial zip code 5 or less digits
export const validPartialZipCodeRegex = new RegExp('^\\d{0,5}$');
export const onlyNumbersRegex = new RegExp('^[0-9]+$');
export const isLowercaseAlphaNumeric = new RegExp('^[a-z0-9]*$');

export const isValidZipCode = (zipCode: string) => {
  return validZipCodeRegex.test(zipCode);
};

export const isOnlyNumbers = (string: string) => {
  return onlyNumbersRegex.test(string);
};

export const isLowercaseOrNumber = (string: string) => {
  return isLowercaseAlphaNumeric.test(string);
};
