function isObject(variable: any): boolean {
  return typeof variable === 'object' && !Array.isArray(variable) && variable !== null;
}

export const validateForm = (form: any): boolean => {
  if (Array.isArray(form)) {
    return validateArray(form);
  }

  return validateObject(form);
};

const validateArray = (arr: any[]): boolean => {
  let isValid = true;

  for (const item of arr) {
    if (!item) {
      continue;
    }

    if (item.validate) {
      isValid = isValid ? item.validate() : isValid;
      continue;
    }

    if (isObject(item) && !validateObject(item)) {
      isValid = false;
    }
  }

  return isValid;
};

const validateObject = (obj: any): boolean => {
  let isValid = true;

  for (const key in obj) {
    const property = obj[key];

    if (!property) {
      continue;
    }

    if (Array.isArray(property)) {
      if (!validateArray(property)) {
        isValid = false;
      }

      continue;
    }

    if (property.validate && !property.validate()) {
      isValid = false;
    }
  }

  return isValid;
};
