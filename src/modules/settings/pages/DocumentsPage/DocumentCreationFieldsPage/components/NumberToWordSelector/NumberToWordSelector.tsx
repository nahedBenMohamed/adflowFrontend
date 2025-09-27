import {
  ClearCrossExtraSmallIcon,
  MyIndicator,
  MySelect,
  SettingsExtraSmallIcon,
  type Option,
  type SelectModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const LanguageButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;

  font-size: 10px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  color: var(--button-text-graphite-secondary-text);

  padding: 2px 6px;
  background: var(--background-blue-20);
  border-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-primary-text);

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-graphite-primary-text);

      svg path {
        fill: var(--button-text-graphite-primary-text);
      }
    `}
`;

const SettingsIconWrapper = styled.div`
  width: 12px;
  height: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    transition: var(--transition-200);
  }
`;

const ClearIconWrapper = styled.button`
  width: 12px;
  height: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg path {
    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

const languages: string[] = ['en', 'fr', 'es', 'ru', 'pt', 'ar', 'tr', 'vi', 'az', 'uk', 'id'];

interface Props {
  model: SelectModel;
}

const NumberToWordSelector = observer((props: Props) => {
  const { model } = props;

  const { t } = useTranslation(['common', 'page.settings']);

  const [opened, { close: hide, open: show }] = useDisclosure(false);

  const getLanguageOptions = (): Option<string>[] =>
    languages.map(lang => ({
      label: t(`languages.${lang}`, { ns: 'common' }),
      value: lang,
    }));

  const handleClear = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    model.setValue(null);
  };

  return (
    <MySelect
      zIndex={10}
      model={model}
      dropdownMinWidth="274px"
      overrideShowHideHandlers={{
        opened,
        hide,
        show,
      }}
      CustomButton={
        <ButtonWrapper>
          <MyIndicator zIndex={1} withBorder disabled={!model.value} size={10} offset={1}>
            <LanguageButton $active={opened}>
              <SettingsIconWrapper>
                <SettingsExtraSmallIcon />
              </SettingsIconWrapper>

              {t('settings_page.templates.document_creation_fields_page.ui.selector.words', {
                ns: 'page.settings',
              })}
            </LanguageButton>
          </MyIndicator>

          {Boolean(model.value) && (
            <ClearIconWrapper onClick={handleClear}>
              <ClearCrossExtraSmallIcon />
            </ClearIconWrapper>
          )}
        </ButtonWrapper>
      }
      options={getLanguageOptions()}
    />
  );
});

NumberToWordSelector.displayName = 'NumberToWordSelector';
export { NumberToWordSelector };
