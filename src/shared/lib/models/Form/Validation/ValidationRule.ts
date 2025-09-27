import { isValidPhoneNumber } from 'libphonenumber-js';
import addressparser from 'nodemailer/lib/addressparser';
import { z } from 'zod';
import { validateColorHex } from '../../../helpers';
import { ValidationCode } from './ValidationCode';
import { ValidationError } from './ValidationError';
import { type ValidationFunc } from './ValidationFunc';

export class ValidationRule {
  code: ValidationCode;
  message: string;

  validationFn: ValidationFunc;

  constructor(code: ValidationCode, message: string, validationFn: ValidationFunc) {
    this.code = code;
    this.message = message;

    this.validationFn = validationFn;
  }

  static required(msg = 'Property is required'): ValidationRule {
    return new ValidationRule(ValidationCode.REQUIRED, msg, value => {
      return value.trim().length > 0;
    });
  }

  static number(message = 'Please enter a valid number'): ValidationRule {
    return new ValidationRule(ValidationCode.NUMBER, message, v => {
      if (v.length === 0) {
        return true;
      }

      return !isNaN(v.replace(',', '.'));
    });
  }

  static min(
    min: number,
    message = `Please enter a number greater than or equal to ${min}`
  ): ValidationRule {
    return new ValidationRule(ValidationCode.MIN, message, v => {
      if (!this.number().validationFn(v)) {
        return false;
      }

      return Number(v) >= min;
    });
  }

  static max(
    max: number,
    message = `Please enter a number less than or equal to ${max}`
  ): ValidationRule {
    return new ValidationRule(ValidationCode.MAX, message, v => {
      if (!this.number().validationFn(v)) {
        return false;
      }

      return Number(v) <= max;
    });
  }

  static between(
    min: number,
    max: number,
    message = `Please enter a number between ${min} and ${max}`
  ): ValidationRule {
    return new ValidationRule(
      ValidationCode.BETWEEN,
      message,
      v => this.min(min).validationFn(v) && this.max(max).validationFn(v)
    );
  }

  static email(message = 'Invalid email'): ValidationRule {
    return new ValidationRule(ValidationCode.EMAIL, message, v => {
      try {
        z.string().email().parse(v);

        return true;
      } catch (e) {
        return false;
      }
    });
  }

  static emailRFC5322(message = 'Invalid email'): ValidationRule {
    return new ValidationRule(ValidationCode.EMAIL_RFC5322, message, v => {
      try {
        const result = addressparser(v, { flatten: true })[0];

        if (!result) {
          return false;
        }

        z.string().email().parse(result.address);

        return true;
      } catch (e) {
        return false;
      }
    });
  }

  static phoneInternational(message = 'Invalid international phone format'): ValidationRule {
    return new ValidationRule(ValidationCode.PHONE_INTERNATIONAL, message, v => {
      if (v.length === 0) {
        return true;
      }

      return isValidPhoneNumber(v);
    });
  }

  static colorHex(message = 'Invalid color format'): ValidationRule {
    return new ValidationRule(ValidationCode.COLOR_HEX, message, validateColorHex);
  }

  static httpUrl(message = 'Invalid URL format'): ValidationRule {
    return new ValidationRule(ValidationCode.HTTP_URL, message, v => URL.canParse(v));
  }

  static httpHeaderKey(message = 'Invalid header format'): ValidationRule {
    return new ValidationRule(ValidationCode.HTTP_HEADER_KEY, message, v =>
      /^[A-Z0-9-]+$/i.test(v)
    );
  }

  static printableAscii(message = 'Should contain only printable ASCII'): ValidationRule {
    return new ValidationRule(ValidationCode.PRINTABLE_ASCII, message, v =>
      /^[\x20-\x7E]+$/.test(v)
    );
  }

  validate = (value: unknown): void => {
    const isValid = this.validationFn(value);

    if (!isValid) {
      throw new ValidationError(this.code, this.message);
    }
  };
}
