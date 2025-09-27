import { FieldCode, type TextFieldValue } from '@/modules/fields';
import {
  type DadataBankRequisitesSuggestion,
  type DadataOrgRequisitesSuggestion,
  type Optional,
  UtcDate,
} from '@/shared';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  changeTextFieldModelValueByCode: ({
    code,
    value,
  }: {
    code: FieldCode;
    value: string;
  }) => Optional<TextFieldValue>;
  setEntityName: (entityName: string) => void;
}

interface UseRequisitesSuggestions {
  handleSelectOrgRequisitesSuggestion: (suggestion: DadataOrgRequisitesSuggestion) => void;
  handleSelectBankRequisitesSuggestion: (suggestion: DadataBankRequisitesSuggestion) => void;
}

export const useRequisitesSuggestions = (props: Props): UseRequisitesSuggestions => {
  const { changeTextFieldModelValueByCode, setEntityName } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const handleSelectBankRequisitesSuggestion = useCallback(
    (suggestion: DadataBankRequisitesSuggestion) => {
      if (suggestion.value) {
        changeTextFieldModelValueByCode({
          code: FieldCode.BANK_NAME,
          value: suggestion.value,
        });
      } else if (suggestion.unrestrictedValue) {
        changeTextFieldModelValueByCode({
          code: FieldCode.BANK_NAME,
          value: suggestion.unrestrictedValue,
        });
      }

      if (suggestion.bic)
        changeTextFieldModelValueByCode({ code: FieldCode.BANK_BIC, value: suggestion.bic });

      if (suggestion.swift)
        changeTextFieldModelValueByCode({ code: FieldCode.BANK_SWIFT, value: suggestion.swift });

      if (suggestion.inn)
        changeTextFieldModelValueByCode({ code: FieldCode.BANK_TIN, value: suggestion.inn });

      if (suggestion.kpp)
        changeTextFieldModelValueByCode({ code: FieldCode.BANK_TRRC, value: suggestion.kpp });

      if (suggestion.correspondentAccount)
        changeTextFieldModelValueByCode({
          code: FieldCode.BANK_CORRESPONDENT_ACCOUNT,
          value: suggestion.correspondentAccount,
        });

      if (suggestion.paymentCity)
        changeTextFieldModelValueByCode({
          code: FieldCode.BANK_PAYMENT_CITY,
          value: suggestion.paymentCity,
        });

      if (suggestion.opf?.type)
        changeTextFieldModelValueByCode({
          code: FieldCode.BANK_OPF_TYPE,
          value: t(`opf.${suggestion.opf.type.toLowerCase()}`),
        });
    },
    [changeTextFieldModelValueByCode, t]
  );

  const handleSelectOrgRequisitesSuggestion = useCallback(
    (suggestion: DadataOrgRequisitesSuggestion) => {
      if (suggestion.name?.short) {
        setEntityName(suggestion.name.short);
      } else if (suggestion.value) {
        setEntityName(suggestion.value);
      } else if (suggestion.unrestrictedValue) {
        setEntityName(suggestion.unrestrictedValue);
      }

      if (suggestion.inn)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_TIN,
          value: suggestion.inn,
        });

      if (suggestion.kpp)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_TRRC,
          value: suggestion.kpp,
        });

      if (suggestion.ogrn)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_PSRN,
          value: suggestion.ogrn,
        });

      if (suggestion.type)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_TYPE,
          value: t(`type.${suggestion.type.toLowerCase()}`),
        });

      if (suggestion.name?.full)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_FULL_NAME,
          value: suggestion.name.full,
        });

      if (suggestion.name?.short) {
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_SHORT_NAME,
          value: suggestion.name.short,
        });
      } else if (suggestion.value) {
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_SHORT_NAME,
          value: suggestion.value,
        });
      } else if (suggestion.unrestrictedValue) {
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_SHORT_NAME,
          value: suggestion.unrestrictedValue,
        });
      }

      if (suggestion.fio?.name)
        changeTextFieldModelValueByCode({
          code: FieldCode.IE_NAME,
          value: suggestion.fio.name,
        });

      if (suggestion.fio?.surname)
        changeTextFieldModelValueByCode({
          code: FieldCode.IE_SURNAME,
          value: suggestion.fio.surname,
        });

      if (suggestion.fio?.patronymic)
        changeTextFieldModelValueByCode({
          code: FieldCode.IE_PATRONYMIC,
          value: suggestion.fio.patronymic,
        });

      if (suggestion.management?.name)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_MANAGEMENT_NAME,
          value: suggestion.management.name,
        });

      if (suggestion.management?.post)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_MANAGEMENT_POST,
          value: suggestion.management.post,
        });

      if (suggestion.management?.startDate)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_MANAGEMENT_START_DATE,
          value: UtcDate.parseISO(suggestion.management.startDate).displayLong(),
        });

      if (suggestion.branchCount)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_BRANCH_COUNT,
          value: String(suggestion.branchCount),
        });

      if (suggestion.branchType)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_BRANCH_TYPE,
          value: t(`branch_type.${suggestion.branchType.toLowerCase()}`),
        });

      if (suggestion.address?.unrestrictedValue)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_ADDRESS,
          value: suggestion.address.unrestrictedValue,
        });

      if (suggestion.state?.registrationDate)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_REG_DATE,
          value: UtcDate.parseISO(suggestion.state.registrationDate).displayLong(),
        });

      if (suggestion.state?.liquidationDate)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_LIQUIDATION_DATE,
          value: UtcDate.parseISO(suggestion.state.liquidationDate).displayLong(),
        });

      if (suggestion.state?.status)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_STATUS,
          value: t(`status.${suggestion.state.status.toLowerCase()}`),
        });

      if (suggestion.okato)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_OKATO,
          value: suggestion.okato,
        });

      if (suggestion.oktmo)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_OKTMO,
          value: suggestion.oktmo,
        });

      if (suggestion.okpo)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_OKPO,
          value: suggestion.okpo,
        });

      if (suggestion.okogu)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_OKOGU,
          value: suggestion.okogu,
        });

      if (suggestion.okfs)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_OKFS,
          value: suggestion.okfs,
        });

      if (suggestion.okved)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_OKVED,
          value: suggestion.okved,
        });

      if (suggestion.employeeCount)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_EMPLOYEE_COUNT,
          value: String(suggestion.employeeCount),
        });

      const makeFormattedStringFromArray = (arr: string[]): string => arr.slice(10).join(', ');

      if (suggestion.founders)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_FOUNDERS,
          value: makeFormattedStringFromArray(suggestion.founders),
        });

      if (suggestion.managers)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_MANAGERS,
          value: makeFormattedStringFromArray(suggestion.managers),
        });

      if (suggestion.capital)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_CAPITAL,
          value: suggestion.capital,
        });

      if (suggestion.licenses)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_LICENSES,
          value: makeFormattedStringFromArray(suggestion.licenses),
        });

      if (suggestion.phones)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_PHONES,
          value: makeFormattedStringFromArray(suggestion.phones),
        });

      if (suggestion.emails)
        changeTextFieldModelValueByCode({
          code: FieldCode.ORG_EMAILS,
          value: makeFormattedStringFromArray(suggestion.emails),
        });
    },
    [setEntityName, changeTextFieldModelValueByCode, t]
  );

  return {
    handleSelectBankRequisitesSuggestion,
    handleSelectOrgRequisitesSuggestion,
  };
};
