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
import type { MouseEventHandler } from 'react';
import styled, { css } from 'styled-components';
import { RussianCase } from '../../../../../shared';

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RussianCaseButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 2px;

  padding: 2px 6px;
  background: var(--background-blue-20);
  border-radius: var(--border-radius-element);

  font-size: 10px;
  font-weight: 500;
  text-align: center;
  white-space: nowrap;
  text-transform: uppercase;
  color: var(--button-text-graphite-secondary-text);
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

const casesOptions: Option<RussianCase>[] = [
  {
    label: 'Именительный падеж (Кто? Что?)',
    value: RussianCase.NOMINATIVE,
  },
  {
    label: 'Родительный падеж (Кого? Чего?)',
    value: RussianCase.GENITIVE,
  },
  {
    label: 'Дательный падеж (Кому? Чему?)',
    value: RussianCase.DATIVE,
  },
  {
    label: 'Винительный падеж (Кого? Что?)',
    value: RussianCase.ACCUSATIVE,
  },
  {
    label: 'Творительный падеж (Кем? Чем?)',
    value: RussianCase.INSTRUMENTAL,
  },
  {
    label: 'Предложный падеж (О ком? О чем?)',
    value: RussianCase.PREPOSITIONAL,
  },
];

interface Props {
  model: SelectModel;
}

const RussianCaseSelector = observer((props: Props) => {
  const { model } = props;

  const [opened, { close, open }] = useDisclosure(false);

  const handleClear: MouseEventHandler<HTMLButtonElement> = e => {
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
        hide: close,
        show: open,
      }}
      CustomButton={
        <ButtonWrapper>
          <MyIndicator zIndex={1} withBorder disabled={!model.value} size={10} offset={1}>
            <RussianCaseButton $active={opened}>
              <SettingsIconWrapper>
                <SettingsExtraSmallIcon />
              </SettingsIconWrapper>

              {'Падежи'}
            </RussianCaseButton>
          </MyIndicator>

          {Boolean(model.value) && (
            <ClearIconWrapper onClick={handleClear}>
              <ClearCrossExtraSmallIcon />
            </ClearIconWrapper>
          )}
        </ButtonWrapper>
      }
      options={casesOptions}
    />
  );
});

RussianCaseSelector.displayName = 'RussianCaseSelector';
export { RussianCaseSelector };
