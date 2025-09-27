import { followElement, MiniLoader, type Nullable, type Optional } from '@/shared';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useDropdownWidth } from '../../../../hooks';
import { TruncateMixin } from '../../../../mixins';
import type { MultiselectModel, Option } from '../../../../models';
import { ColorUtil } from '../../../../utils';
import { CreateButton } from '../../../Buttons/CreateButton/CreateButton';
import { MySelectStyledDropdown, NoOptionsMessage } from '../../MySelect/components';
import {
  SELECT_OPTION_ITEM_DATA_ACTIVE,
  SelectOptionItem,
  SelectOptionsList,
} from '../../components';
import { MyMultiselectColoredTag } from '../components';

interface TagListProps {
  $margin?: string;
  $paddingTop?: string;
  $tableView?: boolean;
}

const TagsList = styled.ul<TagListProps>`
  width: 100%;

  display: flex;
  flex: auto;
  flex-wrap: wrap;
  gap: 8px;

  margin: ${p => p.$margin ?? 0};
  padding-top: ${p => p.$paddingTop};

  &:hover {
    cursor: pointer;
  }

  ${TruncateMixin}

  ${p =>
    p.$tableView &&
    css`
      flex-wrap: nowrap;
      align-items: center;
    `}
`;

type MultiselectOption = Option<string | number, Optional<{ bgColor?: Nullable<string> }>>;

interface Props<O extends MultiselectOption> {
  model: MultiselectModel<O['value']>;
  options: O[];
  withinPortal?: boolean;
  placeholder?: string;
  margin?: string;
  loading?: boolean;
  paddingTop?: string;
  tableView?: boolean;
  monochrome?: boolean;
  handleChange?: (values: O['value'][]) => void;
}

const MyMultiselectColored = observer(<O extends MultiselectOption>(props: Props<O>) => {
  const {
    model,
    options,
    placeholder,
    loading,
    withinPortal = false,
    margin,
    paddingTop,
    tableView,
    monochrome,
    handleChange,
  } = props;

  const { t } = useTranslation();

  const [opened, { toggle, close, open }] = useDisclosure(false);

  const [selectedOptions, setSelectedOptions] = useState<O[]>([]);
  const [availableOptions, setAvailableOptions] = useState<O[]>(options);

  const syncOptionsWithModel = useCallback((): void => {
    const selectedOptions: O[] = [];
    const availableOptions: O[] = [];

    // we use temporary optional chaining here because of backend data inconsistency
    // TODO: remove optional chaining when backend data will be consistent
    model.values?.forEach?.(v => {
      const option = options.find(o => o.value === v);

      if (option) selectedOptions.push(option);
    });

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setSelectedOptions(selectedOptions);

    options?.forEach?.(o => {
      if (!selectedOptions.includes(o)) availableOptions.push(o);
    });

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setAvailableOptions(availableOptions);
  }, [model.values, options]);

  const onChange = useCallback(
    (option: O) => {
      if (model.values.includes(option.value)) {
        model.setValue(model.values.filter(value => value !== option.value));
      } else {
        model.setValue([...model.values, option.value]);
      }

      syncOptionsWithModel();
      handleChange?.(model.values);
    },
    [model, syncOptionsWithModel, handleChange]
  );

  const handleDelete = useCallback(
    (value: O['value']) => {
      model.setValue(model.values.filter(v => v !== value));
      syncOptionsWithModel();

      handleChange?.(model.values);
    },
    [model, syncOptionsWithModel, handleChange]
  );

  useEffect(() => {
    syncOptionsWithModel();
  }, [model.values, syncOptionsWithModel]);

  const [dropdownWidth, listRef] = useDropdownWidth<HTMLUListElement>();

  const [containerRef, setContainerRef] = useState<Nullable<HTMLUListElement>>(null);

  const [current, setCurrent] = useState(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      switch (e.key) {
        case 'ArrowUp':
          setCurrent(prev => (prev > 0 ? prev - 1 : prev));

          followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });

          break;

        case 'ArrowDown':
          setCurrent(prev => (prev < availableOptions.length - 1 ? prev + 1 : prev));

          followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });

          break;

        case 'Enter':
          const option = availableOptions[current];

          if (option) onChange(option);

          break;

        default:
          return;
      }
    },
    [availableOptions, containerRef, current, onChange]
  );

  return (
    <Menu
      opened={opened}
      closeOnClickOutside
      position="bottom-start"
      withinPortal={withinPortal}
      zIndex="var(--dropdown-z-index)"
      onOpen={loading ? undefined : open}
      onClose={close}
    >
      <Menu.Target>
        <TagsList
          ref={listRef}
          $margin={margin}
          $tableView={tableView}
          $paddingTop={paddingTop}
          onClick={toggle}
        >
          <CreateButton
            customTitle={placeholder}
            invalid={!model.isValid}
            active={opened}
            onClick={toggle}
          />

          {loading && <MiniLoader color="var(--primary-statuses-green-520)" />}

          {!loading &&
            selectedOptions.length > 0 &&
            selectedOptions.map(o => {
              const bgColor =
                o.extra?.bgColor && !monochrome
                  ? ColorUtil.getProcessedBGColor(o.extra?.bgColor)
                  : 'var(--button-text-graphite-primary-text)';
              const color = monochrome
                ? 'var(--primary-statuses-white-0)'
                : ColorUtil.getTextContrastColorByBgColorHex(bgColor);

              return (
                <MyMultiselectColoredTag
                  key={o.value}
                  color={color}
                  name={o.label}
                  bgColor={bgColor}
                  handleDelete={() => handleDelete(o.value)}
                />
              );
            })}
        </TagsList>
      </Menu.Target>

      <MySelectStyledDropdown
        $maxWidth="240px"
        $minWidth="160px"
        $width={dropdownWidth}
        className="workspace__MyDropdown--StyledDropdown"
        onKeyDown={handleKeyDown}
      >
        {availableOptions.length ? (
          <SelectOptionsList
            ref={setContainerRef}
            transparentScrollbarTrack
            padding={monochrome ? '8px' : undefined}
          >
            {availableOptions.map((o, idx) => (
              <SelectOptionItem
                key={o.value}
                label={o.label}
                focused={idx === current}
                bgColor={monochrome ? undefined : (o.extra?.bgColor ?? undefined)}
                onSelect={() => onChange(o)}
              />
            ))}
          </SelectOptionsList>
        ) : (
          <NoOptionsMessage>{t('form.my_select.no_options')}</NoOptionsMessage>
        )}
      </MySelectStyledDropdown>
    </Menu>
  );
});

MyMultiselectColored.displayName = 'MyMultiselectColored';
export { MyMultiselectColored };
