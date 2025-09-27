import {
  ControlButton,
  DropdownScrollbarMixin,
  InputModel,
  MyDropdown,
  MyInputWithLimitedLength,
  MySelectTitle,
  PlusIconButton,
  SpanWithEllipsis,
  truncateNumber,
  type Nullable,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldOptionStore } from '../../../../../../store';
import { ListSelectIcon } from '../../../../../assets';
import type { FieldOption } from '../../../../models';
import { OPTION_MAX_LENGTH, OptionBlock } from '../OptionBlock/OptionBlock';

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ItemsBlock = styled.div`
  max-height: 240px;

  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow-x: hidden;

  ${DropdownScrollbarMixin}

  padding: 16px;
`;

const AddItemBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 16px;
  border-top: 1px solid var(--graphite-graphite-80);
`;

const AddButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

const ListSelectIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoOptionsAnnotation = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);

  padding: 6px 10px;
`;

interface Props {
  colorful: boolean;
  options: FieldOption[];
  handleChange: (options: FieldOption[]) => void;
}

const SelectOptions = observer((props: Props) => {
  const { colorful, options, handleChange } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.edit_fields.select_options',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [controlsRef, setControlsRef] = useState<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    controlsRef && autoAnimate(controlsRef);
  }, [controlsRef]);

  const fieldOptionStore = useMemo(() => new FieldOptionStore(options), [options]);

  const { options: fieldOptions } = fieldOptionStore;

  const addItemValue = useLocalObservable(() => InputModel.create().required());

  const [opened, { close, open }] = useDisclosure(false);
  const [addModeActive, { close: hideAddMode, open: showAddMode }] = useDisclosure(false);

  const handleChangeAddOptionInput = () => {
    if (addItemValue.isErrorShown) addItemValue.clearError();
  };

  const handleAddOption = () => {
    if (!addItemValue.validate()) return;

    // to prevent adding already existing options
    if (options.map(o => o.label).includes(addItemValue.value)) {
      addItemValue.showError('Option already exists');

      return;
    }

    fieldOptionStore.addOption(addItemValue.value);
    addItemValue.value = '';

    handleChange(fieldOptionStore.realOptions);

    inputRef.current?.focus();
  };

  const handleDeleteOption = (id: number) => {
    fieldOptionStore.deleteOption(id);
    handleChange(fieldOptionStore.realOptions);
  };

  const handleChangeLabel = ({ id, label }: { id: number; label: string }) => {
    fieldOptionStore.changeOptionLabel({ id, label });

    handleChange(fieldOptionStore.realOptions);
  };

  const handleChangeColor = ({ id, color }: { id: number; color: string }) => {
    fieldOptionStore.changeOptionColor({ id, color });

    handleChange(fieldOptionStore.realOptions);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    handleAddOption();
  };

  const handleShowAddMode = () => {
    flushSync(() => {
      showAddMode();
    });

    inputRef.current?.focus();
  };

  const handleHideAddMode = () => {
    addItemValue.value = '';

    hideAddMode();
  };

  const handleChangeOpened = (opened: boolean) => {
    if (!opened) hideAddMode();
  };

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-start"
      dropdownMinWidth="280px"
      Button={
        <MySelectTitle gap="6px" active={opened} variant="outlined" minWidth={0}>
          <TitleWrapper>
            <ListSelectIconWrapper>
              <ListSelectIcon />
            </ListSelectIconWrapper>

            <SpanWithEllipsis
              text={String(truncateNumber({ num: fieldOptions.length, precision: 3 }))}
            />
          </TitleWrapper>
        </MySelectTitle>
      }
      show={open}
      hide={close}
      onChange={handleChangeOpened}
    >
      <ItemsBlock>
        {fieldOptions.length > 0 ? (
          fieldOptions.map(o => (
            <OptionBlock
              key={o.id}
              option={o}
              colorful={colorful}
              onChangeColor={handleChangeColor}
              onChangeLabel={handleChangeLabel}
              onDeleteOption={() => handleDeleteOption(o.id)}
            />
          ))
        ) : (
          <NoOptionsAnnotation>{t('no_options')}</NoOptionsAnnotation>
        )}
      </ItemsBlock>

      <AddItemBlock ref={setControlsRef}>
        {addModeActive ? (
          <>
            <MyInputWithLimitedLength
              autoFocus
              ref={inputRef}
              hasBorderBottom
              variant="outlined"
              model={addItemValue}
              maxLength={OPTION_MAX_LENGTH}
              placeholder={t('placeholders.option')}
              hint={t('max_length', { length: OPTION_MAX_LENGTH })}
              handleChange={handleChangeAddOptionInput}
              onKeyDown={handleEnter}
            />

            <AddButtonWrapper>
              <ControlButton variant="cancel" onClick={handleHideAddMode}>
                {t('cancel')}
              </ControlButton>

              <ControlButton onClick={handleAddOption}>{t('add')}</ControlButton>
            </AddButtonWrapper>
          </>
        ) : (
          <PlusIconButton isGreen text={t('add_option')} onClick={handleShowAddMode} />
        )}
      </AddItemBlock>
    </MyDropdown>
  );
});

SelectOptions.displayName = 'SelectOptions';
export { SelectOptions };
