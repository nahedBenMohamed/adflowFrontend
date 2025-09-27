import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DropdownScrollbarMixin } from '../../../../mixins';
import type { Option } from '../../../../models';
import { NoOptionsMessage } from '../../../Form/MySelect/components';
import { MiniLoader } from '../../../Loaders/MiniLoader/MiniLoader';
import { MyDropdownItem } from '../MyDropdownItem/MyDropdownItem';

interface ListProps {
  $maxHeight: string;
  $width?: number;
  $noPadding?: boolean;
  $minWidth?: string;
}

export const MyDropdownListRoot = styled.ul<ListProps>`
  height: 100%;
  width: ${p => p.$width}px;
  min-width: ${p => p.$minWidth};
  max-height: ${p => p.$maxHeight};

  display: flex;
  flex-direction: column;

  ${DropdownScrollbarMixin}

  ${p => p.$noPadding && `padding: 0`};
`;

export interface MyDropdownListOptionsMeta {
  value: unknown;
  meta: string;
}

interface Props<O extends Option> {
  options: O[];
  width?: number;
  filter?: string;
  activeValue?: any;
  minWidth?: string;
  maxHeight?: string;
  highlight?: string;
  noPadding?: boolean;
  indexAsKey?: boolean;
  optionsLoading?: boolean;
  noOptionsMessage?: string;
  optionsMeta?: MyDropdownListOptionsMeta[];
  onSelect: (option: O) => void;
}

const MyDropdownList = observer(<O extends Option>(props: Props<O>) => {
  const {
    options,
    width,
    filter,
    minWidth,
    highlight,
    noPadding,
    indexAsKey,
    activeValue,
    optionsMeta,
    optionsLoading,
    noOptionsMessage,
    maxHeight = '336px',
    onSelect,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const getOptions = useCallback(
    (): O[] => (filter ? options.filter(o => o.label.includes(filter)) : options),
    [filter, options]
  );

  const filteredOptions = useMemo<O[]>(() => getOptions(), [getOptions]);

  const getSelectHandler = useCallback((option: O) => () => onSelect(option), [onSelect]);

  const compareStringifiedValues = useCallback(({ val1, val2 }: { val1: O; val2: O }) => {
    if (typeof val1.value === 'function') return val1.value.toString() === JSON.stringify(val2);

    return JSON.stringify(val1.value) === JSON.stringify(val2);
  }, []);

  return (
    <MyDropdownListRoot
      $width={width}
      $minWidth={minWidth}
      $noPadding={noPadding}
      $maxHeight={maxHeight}
    >
      {filteredOptions.length > 0 ? (
        filteredOptions.map((o, idx) => (
          <MyDropdownItem
            key={
              indexAsKey
                ? idx
                : typeof o.value === 'function'
                  ? o.value.toString()
                  : JSON.stringify(o.value)
            }
            title={o.label}
            highlight={highlight}
            // in case value is an object or class exemplar
            active={compareStringifiedValues({ val1: o, val2: activeValue })}
            optionMeta={
              optionsMeta &&
              optionsMeta.find(m => JSON.stringify(m.value) === JSON.stringify(o.value))?.meta
            }
            onClick={getSelectHandler(o)}
          />
        ))
      ) : (
        <NoOptionsMessage>
          {optionsLoading ? (
            <MiniLoader color="var(--primary-statuses-green-520)" />
          ) : (
            (noOptionsMessage ?? t('no_options'))
          )}
        </NoOptionsMessage>
      )}
    </MyDropdownListRoot>
  );
});

MyDropdownList.displayName = 'MyDropdownList';
export { MyDropdownList };
