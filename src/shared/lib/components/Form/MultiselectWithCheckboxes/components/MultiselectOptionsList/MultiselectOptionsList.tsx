import { observer, useLocalObservable } from 'mobx-react-lite';
import { Fragment, useCallback, useMemo, type ReactEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAutoFocusOnMount } from '../../../../../hooks';
import { DropdownScrollbarMixin } from '../../../../../mixins';
import { InputModel, type MySelectTitleRootVariant, type Option } from '../../../../../models';
import { MySelectSearchBlock, NoOptionsMessage } from '../../../MySelect/components';
import { SelectAllBlock } from '../../../UserPicker/components';
import { MultiselectOptionItem } from '../MultiselectOptionItem/MultiselectOptionItem';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;

const List = styled.div<{ $maxHeight?: string }>`
  height: 100%;
  max-height: ${p => p.$maxHeight};

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  overflow-x: hidden;

  ${DropdownScrollbarMixin}
`;

const Delimiter = styled.hr`
  width: 100%;

  border-top: 1px solid var(--graphite-graphite-80);
`;

const GroupName = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);

  padding: 8px 8px 8px 28px;
`;

export interface MultiselectOptionsListGroup {
  groupId: string;
  groupName: string;
}

interface Props<O extends Option> {
  maxHeight?: string;
  options: O[];
  currentValues: unknown[];
  highlight?: string;
  variant?: MySelectTitleRootVariant;
  hideSearch?: boolean;
  // for groups to work – if Option belongs to group, it should have groupId property in extra object
  groups?: MultiselectOptionsListGroup[];
  onSelect: (value: O['value']) => void;
  onCancel: (value: O['value']) => void;
  onSelectGroup?: (value: O['value'][]) => void;
}

const MultiselectOptionsList = observer(<O extends Option>(props: Props<O>) => {
  const {
    maxHeight,
    options,
    currentValues,
    variant = 'filled',
    highlight,
    hideSearch,
    groups,
    onSelect,
    onCancel,
    onSelectGroup,
  } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'form.my_select',
  });

  const searchInputRef = useAutoFocusOnMount();

  const searchModel = useLocalObservable(() => InputModel.create());

  const handleClearSearch = useCallback<ReactEventHandler<HTMLButtonElement>>(
    e => {
      e.stopPropagation();

      searchModel.value = '';
      searchInputRef.current?.focus();
    },
    [searchInputRef, searchModel]
  );

  const isSearchBarShown = hideSearch ? false : options.length >= 10;

  const filteredOptions = useMemo<O[]>(() => {
    const searchValue = searchModel.value.toLowerCase();

    return options.filter(o => o.label.toLowerCase().includes(searchValue));
  }, [options, searchModel.value]);

  const allSelected = options.length === currentValues.length;

  const toggleSelectAll = useCallback(() => {
    if (!onSelectGroup)
      throw new Error('Failed to toggleSelectAll, onSelectGroup handler was not provided');

    if (allSelected) {
      onSelectGroup([]);
    } else {
      onSelectGroup(options.map(o => o.value));
    }
  }, [allSelected, onSelectGroup, options]);

  return (
    <Root>
      {isSearchBarShown && (
        <MySelectSearchBlock
          ref={searchInputRef}
          model={searchModel}
          handleClear={handleClearSearch}
        />
      )}

      <List $maxHeight={maxHeight}>
        {filteredOptions.length > 4 && onSelectGroup && (
          <SelectAllBlock
            height="36px"
            allSelected={allSelected}
            toggleSelectAll={toggleSelectAll}
          />
        )}

        {filteredOptions.length > 0 ? (
          <>
            {/* Options without group */}
            {filteredOptions
              .filter(o => !o.extra?.groupId)
              .map(o => (
                <MultiselectOptionItem
                  key={JSON.stringify(o.value)}
                  option={o}
                  variant={variant}
                  highlight={highlight || searchModel.trimmedValue}
                  active={Boolean(
                    currentValues.find(v => JSON.stringify(v) === JSON.stringify(o.value))
                  )}
                  onSelect={onSelect}
                  onCancel={onCancel}
                />
              ))}

            {/* Options with group */}
            {groups?.map(({ groupId, groupName }) => {
              const groupOptions = filteredOptions.filter(o => o.extra?.groupId === groupId);

              return groupOptions.length > 0 ? (
                <Fragment key={groupId}>
                  <GroupName>{groupName}</GroupName>

                  <Delimiter />

                  {groupOptions.map(o => (
                    <MultiselectOptionItem
                      key={JSON.stringify(o.value)}
                      option={o}
                      variant={variant}
                      highlight={highlight || searchModel.trimmedValue}
                      active={Boolean(
                        currentValues.find(v => JSON.stringify(v) === JSON.stringify(o.value))
                      )}
                      onSelect={onSelect}
                      onCancel={onCancel}
                    />
                  ))}
                </Fragment>
              ) : null;
            })}
          </>
        ) : (
          <NoOptionsMessage>{t('no_options')}</NoOptionsMessage>
        )}
      </List>
    </Root>
  );
});

MultiselectOptionsList.displayName = 'MultiselectOptionsList';
export { MultiselectOptionsList };
