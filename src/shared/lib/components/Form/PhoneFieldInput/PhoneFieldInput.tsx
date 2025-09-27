import { generalSettingsStore } from '@/app';
import {
  FieldTextPrimitive,
  type FieldTextPrimitiveProps,
  type MultitextFieldValue,
} from '@/modules/fields';
import { EntityApiUtil } from '@/modules/section/shared/lib/utils/EntityApiUtil';
import { PhoneFormat } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import {
  formatIncompletePhoneNumber,
  isPossiblePhoneNumber,
  type CountryCode,
} from 'libphonenumber-js';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import styled from 'styled-components';
import { debounce, generateCountryCodeFromLanguage } from '../../../helpers';
import { useDropdownWidth } from '../../../hooks';
import {
  FieldType,
  type Entity,
  type InputModel,
  type SearchDuplicatesProps,
} from '../../../models';
import { EntitiesSuggestionsPopover } from '../../EntitiesSuggestionsPopover/EntitiesSuggestionsPopover';
import { MultitextDuplicatesManager } from '../../MultitextDuplicatesManager/MultitextDuplicatesManager';
import { MyPopover } from '../../MyPopover/MyPopover';

const FieldTextInputPrimitiveWrapper = styled.div`
  width: 100%;
`;

interface StyledInputProps {
  $invalid: boolean;
  $readonly?: boolean;
  $height?: CSSProperties['height'];
}

interface Props {
  model: InputModel;
  disabled?: boolean;
  Controls?: ReactNode;
  alwaysInternational?: boolean;
  disableAutocomplete?: boolean;
  searchDuplicatesProps?: SearchDuplicatesProps;
  handleChange?: (phone: string) => void;
}

const sanitizeInternationalNumberFormat = (value: string): string => {
  // make sure that the phone only has digits and possibly + at the beginning
  return value.replace(/[^0-9+]/g, '');
};

const sanitizeFreeNumberFormat = (value: string): string => {
  // allow only digits, special symbols like #, +, -, (, ), and spaces
  return value.replace(/[^0-9#+\-()\s]/g, '');
};

const PhoneFieldInput = observer((props: Props) => {
  const {
    model,
    disabled,
    Controls,
    alwaysInternational,
    disableAutocomplete,
    searchDuplicatesProps,
    handleChange,
  } = props;

  const { accountSettings } = generalSettingsStore;

  if (!accountSettings)
    throw new Error(
      `Account settings must be loaded before editing fields, received ${accountSettings}`
    );

  const [phone, setPhone] = useState<string>(model.value);
  const [formattedPhone, setFormattedPhone] = useState<string>(model.value);

  const isInternational = useMemo<boolean>(
    () => alwaysInternational || accountSettings.phoneFormat === PhoneFormat.INTERNATIONAL,
    [accountSettings.phoneFormat, alwaysInternational]
  );

  const countryCode = useMemo<CountryCode>(
    () => generateCountryCodeFromLanguage(accountSettings.language),
    [accountSettings.language]
  );

  const handleFormatIncompletePhoneNumber = useCallback(
    (value: string) => {
      if (
        isInternational ||
        isPossiblePhoneNumber(value, {
          defaultCountry: countryCode,
        })
      ) {
        setFormattedPhone(
          formatIncompletePhoneNumber(value, {
            defaultCountry: countryCode,
          })
        );
      } else {
        setFormattedPhone(value);
      }
    },
    [countryCode, isInternational]
  );

  const [isPopoverOpened, { close: hidePopover, open: showPopover }] = useDisclosure(false);

  const [possibleDuplicates, setPossibleDuplicates] = useState<Entity[]>([]);
  const [exactDuplicates, setExactDuplicates] = useState<Entity[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedSearchForDuplicates = useCallback(
    debounce(async (phone: string): Promise<void> => {
      if (!searchDuplicatesProps?.searchDuplicates || phone.length < 6) {
        clearDuplicatesInfo();
        hidePopover();

        return;
      }

      const result = await EntityApiUtil.searchEntitiesByFieldFull({
        fieldValue: phone,
        fieldType: FieldType.PHONE,
        entityTypeId: searchDuplicatesProps.entityTypeId,
        excludeEntityId: searchDuplicatesProps.excludeEntitiesId,
      });

      const duplicates = result.entities;

      setPossibleDuplicates(duplicates);

      if (duplicates.length) {
        const exactDuplicates = duplicates.filter(d => {
          const phoneFields = d.fieldValues.filter(fv => fv.fieldType === FieldType.PHONE);

          return phoneFields.some(fv => (fv as MultitextFieldValue).values.some(v => v === phone));
        });

        setExactDuplicates(exactDuplicates);

        showPopover();
      } else {
        hidePopover();
      }
    }, 500),
    []
  );

  useLayoutEffect(() => {
    // to link model value with formatted phone, we need lifecycle method in order
    // to be able to update formatted phone when e.g. card changes are cancelled
    handleFormatIncompletePhoneNumber(model.value);

    setPhone(model.value);
  }, [model.value, handleFormatIncompletePhoneNumber]);

  const onChange = useCallback(
    ({ target: { value: phone } }: ChangeEvent<HTMLInputElement>) => {
      const sanitizedValue = isInternational
        ? sanitizeInternationalNumberFormat(phone)
        : sanitizeFreeNumberFormat(phone);

      setPhone(sanitizedValue);
      model.setValue(sanitizedValue);
      handleChange?.(sanitizedValue);

      handleDebouncedSearchForDuplicates(sanitizedValue);
    },
    [model, isInternational, handleChange, handleDebouncedSearchForDuplicates]
  );

  const [dropdownWidth, ref] = useDropdownWidth<HTMLInputElement>();

  const [duplicatesWarningShown, { open: showDuplicatesWarning, close: hideDuplicatesWarning }] =
    useDisclosure(false);

  const clearDuplicatesInfo = useCallback(() => {
    setExactDuplicates([]);
    setPossibleDuplicates([]);
  }, []);

  const invalid = !model.isValid();

  const commonProps = useMemo(
    () =>
      ({
        $invalid: invalid,
        type: 'tel',
        placeholder: '+__ (___) ___-__-__',
        onChange,
      }) satisfies FieldTextPrimitiveProps<'input'> | StyledInputProps,
    [invalid, onChange]
  );

  const Input = (
    <FieldTextInputPrimitiveWrapper ref={ref}>
      <FieldTextPrimitive
        {...commonProps}
        value={phone}
        noActiveShadow
        renderAs="input"
        readonly={disabled}
        displayValue={formattedPhone}
        Controls={Controls}
        disableAutocomplete={disableAutocomplete}
      />
    </FieldTextInputPrimitiveWrapper>
  );

  const duplicatesAllowed = accountSettings.allowDuplicates;

  if (!searchDuplicatesProps?.searchDuplicates) return Input;

  return (
    <>
      <MyPopover
        withinPortal
        Target={Input}
        rootWidth="100%"
        opened={isPopoverOpened}
        hide={hidePopover}
      >
        <EntitiesSuggestionsPopover
          width={dropdownWidth}
          search={model.value ?? null}
          entities={possibleDuplicates}
          duplicateType={FieldType.PHONE}
          canAddAsNew={duplicatesAllowed && exactDuplicates.length > 0}
          showDuplicatesWarning={showDuplicatesWarning}
          changeEntityCb={searchDuplicatesProps.changeEntityCb}
        />
      </MyPopover>

      <MultitextDuplicatesManager
        inputRef={ref}
        searchModel={model}
        duplicatesAllowed={duplicatesAllowed}
        hasExactDuplicates={exactDuplicates.length > 0}
        duplicatesWarningShown={duplicatesWarningShown}
        hidePopover={hidePopover}
        showPopover={showPopover}
        clearDuplicatesInfo={clearDuplicatesInfo}
        hideDuplicatesWarning={hideDuplicatesWarning}
      />
    </>
  );
});

PhoneFieldInput.displayName = 'PhoneFieldInput';
export { PhoneFieldInput };
