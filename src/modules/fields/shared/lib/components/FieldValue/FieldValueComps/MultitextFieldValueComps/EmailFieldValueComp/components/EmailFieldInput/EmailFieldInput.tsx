import { generalSettingsStore } from '@/app';
import {
  EntitiesSuggestionsPopover,
  EntityApiUtil,
  FieldType,
  MultitextDuplicatesManager,
  MyPopover,
  debounce,
  useDropdownWidth,
  type Entity,
  type InputModel,
  type SearchDuplicatesProps,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import type { MultitextFieldValue } from '../../../../../../../models';
import { FieldTextInput } from '../../../../../../FieldTextInput/FieldTextInput';

const FieldTextInputWrapper = styled.div`
  width: 100%;
`;

interface Props {
  model: InputModel;
  readonly?: boolean;
  searchDuplicateProps?: SearchDuplicatesProps;
  Controls?: ReactNode;
  handleChange?: (email: string) => void;
}

const EmailFieldInput = observer((props: Props) => {
  const { model, readonly, searchDuplicateProps, Controls, handleChange } = props;

  const { accountSettings } = generalSettingsStore;

  if (!accountSettings)
    throw new Error(
      `Account settings must be loaded before editing fields, received ${accountSettings}`
    );

  const [isPopoverOpened, { close: hidePopover, open: showPopover }] = useDisclosure(false);

  const [possibleDuplicates, setPossibleDuplicates] = useState<Entity[]>([]);
  const [exactDuplicates, setExactDuplicates] = useState<Entity[]>([]);

  const duplicatesAllowed = accountSettings.allowDuplicates;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedSearchForDuplicates = useCallback(
    debounce(async (email: string): Promise<void> => {
      if (!searchDuplicateProps?.searchDuplicates || email.length < 4) {
        clearDuplicatesInfo();
        hidePopover();

        return;
      }

      const result = await EntityApiUtil.searchEntitiesByFieldFull({
        fieldValue: email,
        fieldType: FieldType.EMAIL,
        entityTypeId: searchDuplicateProps.entityTypeId,
        excludeEntityId: searchDuplicateProps.excludeEntitiesId,
      });

      const duplicates = result.entities;
      setPossibleDuplicates(duplicates);

      if (duplicates.length) {
        const exactDuplicates = duplicates.filter(d => {
          const phoneFields = d.fieldValues.filter(fv => fv.fieldType === FieldType.EMAIL);

          return phoneFields.some(fv => (fv as MultitextFieldValue).values.some(v => v === email));
        });

        setExactDuplicates(exactDuplicates);

        showPopover();
      } else {
        hidePopover();
      }
    }, 500),
    []
  );

  const onChange = useCallback(
    (email: string) => {
      model.setValue(email);
      handleChange?.(email);

      handleDebouncedSearchForDuplicates(email);
    },
    [model, handleChange, handleDebouncedSearchForDuplicates]
  );

  const [dropdownWidth, ref] = useDropdownWidth<HTMLInputElement>();

  const [duplicatesWarningShown, { open: showDuplicatesWarning, close: hideDuplicatesWarning }] =
    useDisclosure(false);

  const clearDuplicatesInfo = useCallback(() => {
    setExactDuplicates([]);
    setPossibleDuplicates([]);
  }, []);

  const invalid = !model.isValid();

  const Input = useMemo<ReactNode>(
    () => (
      <FieldTextInputWrapper ref={ref}>
        <FieldTextInput
          type="email"
          model={model}
          noActiveShadow
          renderAs="input"
          invalid={invalid}
          Controls={Controls}
          readonly={readonly}
          onChange={onChange}
        />
      </FieldTextInputWrapper>
    ),
    [ref, model, readonly, invalid, Controls, onChange]
  );

  if (!searchDuplicateProps?.searchDuplicates) return Input;

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
          search={model.value || null}
          entities={possibleDuplicates}
          duplicateType={FieldType.EMAIL}
          canAddAsNew={duplicatesAllowed && exactDuplicates.length > 0}
          showDuplicatesWarning={showDuplicatesWarning}
          changeEntityCb={searchDuplicateProps.changeEntityCb}
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
        hideDuplicatesWarning={hideDuplicatesWarning}
        clearDuplicatesInfo={clearDuplicatesInfo}
      />
    </>
  );
});

EmailFieldInput.displayName = 'EmailFieldInput';
export { EmailFieldInput };
