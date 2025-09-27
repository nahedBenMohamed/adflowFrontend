import { computed, makeAutoObservable } from 'mobx';
import { ZodError, type ZodType } from 'zod';
import type { Nullable, Optional } from '../../../types';
import { ValidationError } from '../Validation/ValidationError';
import { ValidationRule } from '../Validation/ValidationRule';

export class InputModel {
  value: string = '';
  isErrorShown = false;

  private _validationRules: ValidationRule[] = [];
  private _zodSchema: ZodType;

  errorMessage: Nullable<string> = null;

  private constructor(initValue = '') {
    this.value = initValue;

    makeAutoObservable(this);
  }

  static create(initValue: Nullable<string> = ''): InputModel {
    return new this(initValue || '');
  }

  static createFromNumber(initValue?: number): InputModel {
    if (initValue === undefined) return new this();

    return new this(String(initValue));
  }

  static createFromNullableNumber(initValue?: Nullable<number>): InputModel {
    if (initValue === null || initValue === undefined) return new this();

    return new this(String(initValue));
  }

  @computed
  get trimmedValue(): string {
    return String(this.value).trim();
  }

  isValid = (): boolean => {
    return this.errorMessage === null && !this.isErrorShown;
  };

  setValue = (value: string): void => {
    this.value = value;
    this.validate();
  };

  setNumberValue = (value: number): void => {
    this.value = String(value);
    this.validate();
  };

  clearError = (): void => {
    this.isErrorShown = false;

    this.errorMessage = null;
  };

  asNumber = (): number => {
    const valueAsNumber = Number(this.trimmedValue.replace(',', '.'));

    if (isNaN(valueAsNumber)) console.error(`Failed to cast ${this.value} to a number`);

    return valueAsNumber ?? 0;
  };

  asNumberOrNull = (): Nullable<number> => {
    const valueAsNumber = Number(this.trimmedValue);

    if (isNaN(valueAsNumber)) return null;

    return this.trimmedValue.length ? valueAsNumber : null;
  };

  asNumberOrUndefined = (): Optional<number> => {
    const valueAsNumber = Number(this.trimmedValue);

    if (isNaN(valueAsNumber)) return;

    return this.trimmedValue.length ? valueAsNumber : undefined;
  };

  asBoolean = (): boolean => {
    return this.value === 'true';
  };

  valueOrNull = (): Nullable<string> => {
    return this.trimmedValue !== '' ? this.value : null;
  };

  showError = (message?: string): this => {
    this.isErrorShown = true;

    this.errorMessage = message ?? null;

    return this;
  };

  required = (message?: string): this => {
    this._validationRules.push(ValidationRule.required(message));

    return this;
  };

  email = (message?: string): this => {
    this._validationRules.push(ValidationRule.email(message));

    return this;
  };

  emailRFC5322 = (): this => {
    this._validationRules.push(ValidationRule.emailRFC5322());

    return this;
  };

  phoneInternational = (): this => {
    this._validationRules.push(ValidationRule.phoneInternational());

    return this;
  };

  number = (): this => {
    this._validationRules.push(ValidationRule.number());

    return this;
  };

  min = (min: number): this => {
    this._validationRules.push(ValidationRule.min(min));

    return this;
  };

  max = (max: number): this => {
    this._validationRules.push(ValidationRule.max(max));

    return this;
  };

  between = (min: number, max: number): this => {
    this._validationRules.push(ValidationRule.between(min, max));

    return this;
  };

  colorHex = (): this => {
    this._validationRules.push(ValidationRule.colorHex());

    return this;
  };

  httpUrl = (): this => {
    this._validationRules.push(ValidationRule.httpUrl());

    return this;
  };

  httpHeaderKey = (): this => {
    this._validationRules.push(ValidationRule.httpHeaderKey());

    return this;
  };

  printableAscii = (): this => {
    this._validationRules.push(ValidationRule.printableAscii());

    return this;
  };

  zod = (schema: ZodType): InputModel => {
    this._zodSchema = schema;

    return this;
  };

  validate = (): boolean => {
    this.errorMessage = null;

    try {
      for (const validationRule of this._validationRules) {
        validationRule.validate(this.value);
      }
    } catch (e) {
      if (e instanceof ValidationError) this.errorMessage = e.message;
    }

    if (this._zodSchema && this.value !== '') {
      try {
        this._zodSchema.parse(this.value);
      } catch (e) {
        if (e instanceof ZodError && e.issues.length !== 0) {
          const firstIssue = e.issues[0];

          if (firstIssue) this.errorMessage = firstIssue.message;
        }
      }
    }

    return this.errorMessage === null;
  };
}
