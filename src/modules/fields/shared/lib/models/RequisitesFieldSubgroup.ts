import { FieldCode } from './Field/FieldCode';

export enum RequisitesFieldSubgroupCode {
  BANK_REQUISITES = 'bank_requisites',
  SP_AND_ORGANIZATION_REQUISITES = 'sp_and_organization_requisites',
  SP_AND_ORGANIZATION_STATISTICAL_CODES = 'sp_and_organization_statistical_codes',
  ADDITIONAL_SP_AND_ORGANIZATION_REQUISITES = 'additional_sp_and_organization_requisites',
}

export const RequisitesFieldSubgroup: Readonly<Record<RequisitesFieldSubgroupCode, FieldCode[]>> =
  Object.freeze({
    [RequisitesFieldSubgroupCode.BANK_REQUISITES]: [
      FieldCode.BANK_NAME,
      FieldCode.BANK_BIC,
      FieldCode.BANK_SWIFT,
      FieldCode.BANK_TIN,
      FieldCode.BANK_TRRC,
      FieldCode.BANK_CORRESPONDENT_ACCOUNT,
      FieldCode.BANK_PAYMENT_CITY,
      FieldCode.BANK_OPF_TYPE,
      FieldCode.BANK_CHECKING_ACCOUNT,
    ],

    [RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_REQUISITES]: [
      FieldCode.ORG_SHORT_NAME,
      FieldCode.ORG_FULL_NAME,
      FieldCode.ORG_TIN,
      FieldCode.ORG_TRRC,
      FieldCode.ORG_PSRN,
      FieldCode.ORG_TYPE,
      FieldCode.IE_NAME,
      FieldCode.IE_SURNAME,
      FieldCode.IE_PATRONYMIC,
      FieldCode.ORG_MANAGEMENT_NAME,
      FieldCode.ORG_MANAGEMENT_POST,
      FieldCode.ORG_MANAGEMENT_START_DATE,
      FieldCode.ORG_BRANCH_COUNT,
      FieldCode.ORG_BRANCH_TYPE,
      FieldCode.ORG_ADDRESS,
      FieldCode.ORG_REG_DATE,
      FieldCode.ORG_LIQUIDATION_DATE,
      FieldCode.ORG_STATUS,
    ],

    [RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_STATISTICAL_CODES]: [
      FieldCode.ORG_OKATO,
      FieldCode.ORG_OKTMO,
      FieldCode.ORG_OKPO,
      FieldCode.ORG_OKOGU,
      FieldCode.ORG_OKFS,
      FieldCode.ORG_OKVED,
    ],

    [RequisitesFieldSubgroupCode.ADDITIONAL_SP_AND_ORGANIZATION_REQUISITES]: [
      FieldCode.ORG_EMPLOYEE_COUNT,
      FieldCode.ORG_FOUNDERS,
      FieldCode.ORG_MANAGERS,
      FieldCode.ORG_CAPITAL,
      FieldCode.ORG_LICENSES,
      FieldCode.ORG_PHONES,
      FieldCode.ORG_EMAILS,
    ],
  });
