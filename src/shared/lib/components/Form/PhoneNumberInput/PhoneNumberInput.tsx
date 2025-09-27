import { utilityApi } from '@/app';
import { observer } from 'mobx-react-lite';
import { useEffect, useState, type FC } from 'react';
import 'react-phone-input-2/lib/style.css';
import styled from 'styled-components';
import type { InputModel } from '../../../models';

// https://github.com/bl00mber/react-phone-input-2/issues/533
import PI, { type PhoneInputProps } from 'react-phone-input-2';
const ReactPhoneInput: FC<PhoneInputProps> = (PI as any).default || PI;

const Root = styled.div`
  .country-list {
    font-family: var(--system-font-families);
    color: var(--button-text-graphite-priory-text);
    font-weight: 400;
  }

  .country {
    &:hover {
      transition: var(--transition-200);
      background-color: var(--graphite-graphite-20) !important;
    }
  }

  .country.highlight {
    background-color: var(--graphite-graphite-40) !important;
  }

  .dial-code {
    font-weight: 500;
    color: var(--button-text-graphite-primary-text) !important;
  }

  input {
    font-family: var(--system-font-families);
    color: var(--button-text-graphite-priory-text);
    font-weight: 400;

    padding-left: 42px !important;
  }

  input::placeholder {
    color: var(--button-text-graphite-secondary-text);
  }
`;

interface Props {
  model: InputModel;
  determineCountry?: boolean;
}

const PhoneNumberInput = observer((props: Props) => {
  const { model, determineCountry = false } = props;

  const [countryCode, setCountryCode] = useState('');

  const getCountryCode = async (): Promise<void> => {
    try {
      const countryCode = await utilityApi.getCountryCode();

      setCountryCode(countryCode);
    } catch (e) {
      setCountryCode('us');

      console.error("Error while identifying user's country code", e);
    }
  };

  useEffect(() => {
    getCountryCode();
  }, []);

  return (
    <Root>
      <ReactPhoneInput
        country={determineCountry ? countryCode : ''}
        value={model.value}
        onChange={(v: string) => {
          model.setValue(v);

          if (v.length > 0) {
            model.setValue('+' + v);
          }
        }}
        inputStyle={{
          width: '100%',
          borderColor:
            'transparent transparent var(--button-text-graphite-secondary-text) transparent',
          borderBottomColor: model.isValid()
            ? 'var(--button-text-graphite-secondary-text)'
            : 'var(--button-text-red-hover)',
          borderRadius: 0,
          height: 'auto',
        }}
        buttonStyle={{
          borderColor:
            'transparent transparent var(--button-text-graphite-secondary-text) transparent',
          borderBottomColor: model.isValid()
            ? 'var(--button-text-graphite-secondary-text)'
            : 'var(--button-text-red-hover)',
          borderRadius: 0,
          backgroundColor: 'transparent',
        }}
        dropdownStyle={{
          backgroundColor: 'var(--primary-statuses-white-0)',
          boxShadow: '0 1px 2px #d0daeb, 0 0 2px #eef4fe',
        }}
        placeholder="+ ..."
      />
    </Root>
  );
});

PhoneNumberInput.displayName = 'PhoneNumberInput';
export { PhoneNumberInput };
