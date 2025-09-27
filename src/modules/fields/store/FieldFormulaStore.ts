import { entityTypeStore } from '@/app';
import { ErrorCode, type Nullable, type Optional, type ServiceError } from '@/shared';
import type { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx';
import { CheckFormulaDto, fieldsSettingsApi } from '../api';
import {
  FieldCode,
  FormulaFieldClasses,
  FormulaFieldMathElementType,
  FormulaFieldMathElementValue,
  type AppendMathElementHandler,
  type FormulaFieldMathElement,
} from '../shared';

const operatorLabelsMap: Record<FormulaFieldMathElementValue, string> = {
  '+': '+',
  '/': '÷',
  '*': '×',
  '-': '-',
  '(': '(',
  ')': ')',
  '%': '%',
  '.': '.',
};

interface MathElementLabel {
  fieldName: string;
  sectionName: string;
}

export class FieldFormulaStore {
  fieldId: number;
  entityTypeId: number;

  formula: Nullable<string>;
  mathElementsArray: FormulaFieldMathElement[] = [];

  fieldFormulaCircularDependencyWarningOpened = false;
  fieldFormulaCircularDependencyId: Nullable<number> = null;

  isFormulaValid = true;
  isCheckingFormula = false;

  private _projectBudgetFieldTitle: string;

  constructor({
    fieldId,
    entityTypeId,
    formula,
    projectBudgetFieldTitle,
  }: {
    fieldId: number;
    entityTypeId: number;
    formula: Nullable<string>;
    projectBudgetFieldTitle: string;
  }) {
    this.fieldId = fieldId;
    this.entityTypeId = entityTypeId;

    this._projectBudgetFieldTitle = projectBudgetFieldTitle;

    this.setInitialFormula(formula);

    makeAutoObservable(this);
  }

  get formulaHTML(): Nullable<string> {
    if (!this.mathElementsArray.length) return null;

    return this.mathElementsArray.map<string>(e => this.getMathElementHTML(e)).join('');
  }

  get formulaString(): Nullable<string> {
    if (!this.mathElementsArray.length) return null;

    return this.mathElementsArray
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map<string>(e => e.value)
      .join('');
  }

  setInitialFormula = (formula: Nullable<string>): void => {
    this.isFormulaValid = true;

    this.formula = formula;

    this.parseMathElementsFromFormula(formula);
  };

  showFieldFormulaCircularDependencyWarning = (): void => {
    this.fieldFormulaCircularDependencyWarningOpened = true;
  };

  hideFieldFormulaCircularDependencyWarning = (): void => {
    this.fieldFormulaCircularDependencyWarningOpened = false;

    this.fieldFormulaCircularDependencyId = null;
  };

  clearFormula = (): void => {
    this.formula = null;
    this.mathElementsArray = [];

    this.isFormulaValid = true;
    this.isCheckingFormula = false;
    this.fieldFormulaCircularDependencyId = null;
    this.fieldFormulaCircularDependencyWarningOpened = false;
  };

  checkFieldFormula = async (): Promise<boolean> => {
    if (!this.formulaString) return true;

    try {
      this.isCheckingFormula = true;

      this.isFormulaValid = await fieldsSettingsApi.checkFieldFormula(
        new CheckFormulaDto({
          fieldId: this.fieldId,
          formula: this.formulaString,
          entityTypeId: this.entityTypeId,
        })
      );

      return this.isFormulaValid;
    } catch (e) {
      const axiosError = e as AxiosError;
      const serviceError = axiosError.response?.data as Optional<ServiceError>;

      if (serviceError?.errorCode === ErrorCode.FIELD_FORMULA_CIRCULAR_DEPENDENCY) {
        this.showFieldFormulaCircularDependencyWarning();

        const fieldId = serviceError?.details?.fieldId;

        if (fieldId && typeof fieldId === 'number') this.fieldFormulaCircularDependencyId = fieldId;
      }

      this.isCheckingFormula = false;
      this.isFormulaValid = false;

      return false;
    } finally {
      this.isCheckingFormula = false;
    }
  };

  getMathElementHTML = (mathElement: FormulaFieldMathElement): string => {
    const classMap: Record<FormulaFieldMathElementType, string> = {
      [FormulaFieldMathElementType.FIELD]: FormulaFieldClasses.FIELD,
      [FormulaFieldMathElementType.NUMBER]: FormulaFieldClasses.NUMBER,
      [FormulaFieldMathElementType.OPERATOR]: FormulaFieldClasses.OPERATOR,
      [FormulaFieldMathElementType.PERCENTAGE]: FormulaFieldClasses.PERCENTAGE,
      [FormulaFieldMathElementType.PARENTHESIS]: FormulaFieldClasses.PARANTHESIS,
      [FormulaFieldMathElementType.DECIMAL_SEPARATOR]: FormulaFieldClasses.DECIMAL_SEPARATOR,
    };

    const mathElementClass = classMap[mathElement.type];

    if (!mathElementClass)
      throw new Error(
        `Invalid math element type ${mathElement.type}, failed to find class in classMap for it`
      );

    return `<span class="${classMap[mathElement.type]}">${this.getMathElementHTMLLabel(mathElement)}</span>`;
  };

  getMathElementHTMLLabel = (mathElement: FormulaFieldMathElement): string => {
    if (mathElement.type === FormulaFieldMathElementType.FIELD) {
      // mathElement label should be stringified { fieldName, sectionName } object
      const { fieldName, sectionName } = JSON.parse(mathElement.label) as MathElementLabel;

      if (!fieldName || !sectionName)
        throw new Error(
          `Invalid field label ${mathElement.label}, failed to parse field name ${fieldName} or section name ${sectionName} from label ${mathElement.label}`
        );

      return `[<b>${fieldName}</b>](<i>${sectionName}</i>)`;
    }

    return mathElement.label;
  };

  parseMathElementsFromFormula = (formula: Nullable<string>): void => {
    if (!formula) {
      this.mathElementsArray = [];

      return;
    }

    // Regex to match field codes, numbers, operators, parentheses, and decimal separators
    const regex = /et\d+_f\d+|\d+|[+\-*/%().]/g;

    const matches = formula.match(regex);

    if (!matches) return;

    this.mathElementsArray = matches.map<FormulaFieldMathElement>((m, idx) => {
      // Match field codes, field codes should be in the format et<entityTypeId>_f<fieldId> ("<" and ">" are representative)
      if (m.match(/et\d+_f\d+/))
        return {
          value: m,
          sortOrder: idx,
          type: FormulaFieldMathElementType.FIELD,
          label: this.getMathElementLabel({
            value: m,
            type: FormulaFieldMathElementType.FIELD,
          }),
        };

      // Match standalone numbers
      if (m.match(/\d+/))
        return {
          value: m,
          sortOrder: idx,
          type: FormulaFieldMathElementType.NUMBER,
          label: this.getMathElementLabel({
            value: m,
            type: FormulaFieldMathElementType.NUMBER,
          }),
        };

      // Match operators
      if (
        [
          FormulaFieldMathElementValue.ADD_OPERATOR,
          FormulaFieldMathElementValue.DIVIDE_OPERATOR,
          FormulaFieldMathElementValue.SUBTRACT_OPERATOR,
          FormulaFieldMathElementValue.MULTIPLY_OPERATOR,
        ].includes(m as FormulaFieldMathElementValue)
      )
        return {
          value: m,
          sortOrder: idx,
          type: FormulaFieldMathElementType.OPERATOR,
          label: this.getMathElementLabel({
            value: m,
            type: FormulaFieldMathElementType.OPERATOR,
          }),
        };

      // Match percentage operator
      if (m === FormulaFieldMathElementValue.PERCENTAGE)
        return {
          value: m,
          sortOrder: idx,
          type: FormulaFieldMathElementType.PERCENTAGE,
          label: this.getMathElementLabel({
            value: m,
            type: FormulaFieldMathElementType.PERCENTAGE,
          }),
        };

      // Match parentheses
      if (
        [
          FormulaFieldMathElementValue.LEFT_PARENTHESIS,
          FormulaFieldMathElementValue.RIGHT_PARENTHESIS,
        ].includes(m as FormulaFieldMathElementValue)
      )
        return {
          value: m,
          sortOrder: idx,
          type: FormulaFieldMathElementType.PARENTHESIS,
          label: this.getMathElementLabel({
            value: m,
            type: FormulaFieldMathElementType.PARENTHESIS,
          }),
        };

      // Match decimal separator
      if (m === FormulaFieldMathElementValue.DECIMAL_SEPARATOR)
        return {
          value: m,
          sortOrder: idx,
          type: FormulaFieldMathElementType.DECIMAL_SEPARATOR,
          label: this.getMathElementLabel({
            value: m,
            type: FormulaFieldMathElementType.DECIMAL_SEPARATOR,
          }),
        };

      throw new Error(`Unknown math element ${m}, formula ${formula} is invalid`);
    });
  };

  getMathElementLabel = ({
    value,
    type,
  }: {
    value: string;
    type: FormulaFieldMathElementType;
  }): string => {
    // field codes are in the format et<entityTypeId>_f<fieldId> ("<" and ">" are representative)
    if (type === FormulaFieldMathElementType.FIELD) {
      const [etIdCode, fieldIdCode] = value.split('_');

      if (!etIdCode || !fieldIdCode)
        throw new Error(
          `Invalid field code ${value}, failed to extract entity type id or field id to get math element label`
        );

      const etId = Number(etIdCode.replace('et', ''));
      const fieldId = Number(fieldIdCode.replace('f', ''));

      if (isNaN(etId) || isNaN(fieldId))
        throw new Error(
          `Invalid field code ${value}, failed to parse field id ${fieldIdCode} or entity type id ${etId} or field id ${fieldId}`
        );

      const et = entityTypeStore.getById(etId);
      const field = et.getFieldById(fieldId);

      const fieldName =
        // project budget field is translated by code, name is not used in display
        et.isProjectCategory() && field.code === FieldCode.VALUE
          ? this._projectBudgetFieldTitle
          : field.name;

      const sectionName = entityTypeStore.getById(etId).name;

      const label: MathElementLabel = { fieldName, sectionName };

      return JSON.stringify(label);
    }

    if (type === FormulaFieldMathElementType.NUMBER) return value;

    return operatorLabelsMap[value as FormulaFieldMathElementValue];
  };

  getLastMathElement = (): Optional<FormulaFieldMathElement> => {
    if (!this.mathElementsArray) return;

    return this.mathElementsArray.at(-1);
  };

  appendMultiplyMathElementToTheEnd = (): void => {
    this.mathElementsArray = [
      ...this.mathElementsArray,
      {
        value: FormulaFieldMathElementValue.MULTIPLY_OPERATOR,
        type: FormulaFieldMathElementType.OPERATOR,
        label: this.getMathElementLabel({
          type: FormulaFieldMathElementType.OPERATOR,
          value: FormulaFieldMathElementValue.MULTIPLY_OPERATOR,
        }),
        sortOrder: this.mathElementsArray.length,
      },
    ];
  };

  appendMathElement: AppendMathElementHandler = mathElement => {
    this.isFormulaValid = true;

    const lastMathElement = this.getLastMathElement();

    switch (mathElement.type) {
      case FormulaFieldMathElementType.OPERATOR: {
        // if last element is already an operator except '-' we can't append another operator, so we
        // remove it and append new one below
        if (
          lastMathElement &&
          mathElement.value !== FormulaFieldMathElementValue.SUBTRACT_OPERATOR &&
          lastMathElement.type === FormulaFieldMathElementType.OPERATOR
        ) {
          this.removeLastMathElement();
        }
        // we can append only '-' operator at the beginning of the formula, because
        // of the negative numbers
        else if (
          !lastMathElement &&
          mathElement.value !== FormulaFieldMathElementValue.SUBTRACT_OPERATOR
        )
          return;

        break;
      }

      case FormulaFieldMathElementType.FIELD: {
        // if last element is a field we can't append another field, so we remove it and append a new one below
        if (lastMathElement && lastMathElement.type === FormulaFieldMathElementType.FIELD) {
          this.removeLastMathElement();
        }
        // if last element is a field, percentage operator or a right parenthesis we can't append a field right after it,
        // so we artificially append an implicit '*' operator and only after that a field itself
        else if (
          lastMathElement &&
          ([
            FormulaFieldMathElementType.FIELD,
            FormulaFieldMathElementType.NUMBER,
            FormulaFieldMathElementType.PERCENTAGE,
          ].includes(lastMathElement.type) ||
            (lastMathElement.type === FormulaFieldMathElementType.PARENTHESIS &&
              lastMathElement.value === FormulaFieldMathElementValue.RIGHT_PARENTHESIS))
        ) {
          this.appendMultiplyMathElementToTheEnd();
        }

        break;
      }

      case FormulaFieldMathElementType.NUMBER: {
        // if last element is a field, percentage operator or a right parenthesis we can't append a number right after it,
        // so we artificially append an implicit '*' operator and only after that a number itself
        if (
          lastMathElement &&
          ([FormulaFieldMathElementType.FIELD, FormulaFieldMathElementType.PERCENTAGE].includes(
            lastMathElement.type
          ) ||
            (lastMathElement.type === FormulaFieldMathElementType.PARENTHESIS &&
              lastMathElement.value === FormulaFieldMathElementValue.RIGHT_PARENTHESIS))
        )
          this.appendMultiplyMathElementToTheEnd();

        break;
      }

      case FormulaFieldMathElementType.DECIMAL_SEPARATOR: {
        // we can't append a decimal separator at the beginning of the formula, so we need to
        // artificially append an implicit '0'
        if (!lastMathElement) {
          this.mathElementsArray = [
            ...this.mathElementsArray,
            {
              value: '0',
              type: FormulaFieldMathElementType.NUMBER,
              label: this.getMathElementLabel({
                type: FormulaFieldMathElementType.NUMBER,
                value: '0',
              }),
              sortOrder: this.mathElementsArray.length,
            },
          ];
          // if we have last element and it's not a number we can't append a decimal separator after it
        } else if (lastMathElement && lastMathElement.type !== FormulaFieldMathElementType.NUMBER) {
          return;
        }

        break;
      }

      case FormulaFieldMathElementType.PARENTHESIS: {
        // if last element is a field, number, percentage operator or a left parenthesis we can't append a left paranthesis right
        // after it, so we artificially append an implicit '*' operator and only after that a number itself
        if (
          lastMathElement &&
          mathElement.value === FormulaFieldMathElementValue.LEFT_PARENTHESIS &&
          ([
            FormulaFieldMathElementType.FIELD,
            FormulaFieldMathElementType.NUMBER,
            FormulaFieldMathElementType.PERCENTAGE,
          ].includes(lastMathElement.type) ||
            (lastMathElement.type === FormulaFieldMathElementType.PARENTHESIS &&
              lastMathElement.value === FormulaFieldMathElementValue.RIGHT_PARENTHESIS))
        ) {
          this.appendMultiplyMathElementToTheEnd();
          // we can't append a right paranthesis at the beginning of the formula
        } else if (
          !lastMathElement &&
          mathElement.value === FormulaFieldMathElementValue.RIGHT_PARENTHESIS
        ) {
          return;
          // we can' append a right paranthesis right after left parenthesis
        } else if (
          lastMathElement &&
          lastMathElement.type === FormulaFieldMathElementType.PARENTHESIS &&
          lastMathElement.value === FormulaFieldMathElementValue.LEFT_PARENTHESIS &&
          mathElement.value === FormulaFieldMathElementValue.RIGHT_PARENTHESIS
        ) {
          return;
        }

        break;
      }

      case FormulaFieldMathElementType.PERCENTAGE: {
        // we can't append a percentage operator at the beginning of the formula
        // or right after another operator
        if (
          !lastMathElement ||
          (lastMathElement && lastMathElement.type === FormulaFieldMathElementType.OPERATOR)
        )
          return;
      }
    }

    const finalNode: FormulaFieldMathElement = {
      ...mathElement,
      label: this.getMathElementLabel({
        type: mathElement.type,
        value: mathElement.value,
      }),
      sortOrder: this.mathElementsArray.length,
    };

    // if after all mutation in switch before if we're trying to append any operator except '-'
    // at the beginning of the formula -> forbid it
    if (
      !this.mathElementsArray.length &&
      mathElement.type === FormulaFieldMathElementType.OPERATOR &&
      mathElement.value !== FormulaFieldMathElementValue.SUBTRACT_OPERATOR
    )
      return;

    this.mathElementsArray = [...this.mathElementsArray, finalNode];
  };

  removeLastMathElement = (): void => {
    this.isFormulaValid = true;

    if (!this.mathElementsArray) return;

    this.mathElementsArray = this.mathElementsArray.slice(0, -1);
  };
}
