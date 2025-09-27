import {
  InputModel,
  MyDropdownList,
  MyPopover,
  SpanWithEllipsis,
  UuidUtil,
  type MultiselectModel,
  type Option,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { DeleteIcon } from '../../../../../assets';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;

  // for proper alignment with the label
  transform: translateY(-2px);
`;

const TagInput = styled.input`
  outline: none;

  height: 22px;
  min-width: 256px;

  display: flex;
  align-items: center;
  flex-shrink: 0;

  line-height: 1;
  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);
`;

const Tag = styled.div<{ $valid: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;

  line-height: 1;
  font-size: 14px;
  font-weight: 400;
  color: var(--button-text-graphite-priory-text);

  padding: 0 2px 0 4px;
  border-radius: var(--border-radius-element);
  background-color: ${p => (p.$valid ? 'var(--graphite-graphite-80)' : 'transparent')};
  border: 1px solid ${p => (p.$valid ? 'transparent' : 'var(--button-text-red-hover)')};
`;

const DeleteIconWrapper = styled.button`
  width: 14px;
  height: 14px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  padding-top: 2px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }

  &:active {
    scale: 0.95;
  }
`;

const OptionsGroupsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 6px 0;
`;

const OptionsGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionGroupTitle = styled.p`
  font-size: 10px;
  font-weight: 600;
  line-height: 18px;
  text-transform: uppercase;
  color: var(--button-text-graphite-primary-text);

  padding: 0 10px;
`;

interface MultiInputTag {
  id: string;
  value: string;
  valid: boolean;
}

interface Props {
  popoverOpened: boolean;
  tagInputModel: InputModel;
  model: MultiselectModel<string>;
  recentsOptions: Option<string>[];
  fromEntityOptions?: Option<string>[];
  hidePopover: () => void;
  showPopover: () => void;
}

const LIST_MAX_HEIGHT = '200px';

const AddressMultiInput = observer((props: Props) => {
  const {
    model,
    tagInputModel,
    popoverOpened,
    recentsOptions,
    fromEntityOptions = [],
    hidePopover,
    showPopover,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const [tags, setTags] = useState<MultiInputTag[]>([]);
  const [rerenderPopoverKey, rerenderPopover] = useReducer(x => ++x, 0);

  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(inputRef as RefObject<HTMLInputElement>, e => {
    const target = e.target as HTMLElement;

    if (
      target.closest('.workspace__MyDropdown--StyledDropdown') ||
      target.closest('.workspace__MyPopover--StyledDropdown')
    )
      return;

    hidePopover();
    handleAddTag();
  });

  const atLeastTwoChars = useMemo<boolean>(
    () => tagInputModel.value.length > 1,
    [tagInputModel.value]
  );
  const filteredRecentOptions = useMemo<Option<string>[]>(
    () => recentsOptions.filter(o => o.value.includes(tagInputModel.value) && atLeastTwoChars),
    [recentsOptions, tagInputModel.value, atLeastTwoChars]
  );

  useEffect(() => {
    if (filteredRecentOptions.length > 0) {
      showPopover();
    } else {
      hidePopover();
    }
  }, [filteredRecentOptions.length, showPopover, hidePopover]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setTags(
      model.values.map<MultiInputTag>(v => ({
        value: v,
        id: UuidUtil.generate(),
        valid: InputModel.create(v).emailRFC5322().validate(),
      }))
    );
  }, [model.values]);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  }, []);

  const handleAddTag = useCallback(() => {
    if (!tagInputModel.value) return;

    rerenderPopover();

    const newTag: MultiInputTag = {
      id: UuidUtil.generate(),
      value: tagInputModel.value,
      valid: tagInputModel.validate(),
    };

    model.setValue([...model.values, newTag.value]);

    tagInputModel.value = '';
    hidePopover();
  }, [model, tagInputModel, hidePopover]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Backspace' && !tagInputModel.value) {
        e.preventDefault();

        const newTags = tags.slice(0, tags.length - 1);
        setTags(newTags);
        model.setValue(newTags.map(tag => tag.value));

        hidePopover();

        return;
      }

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();

        handleAddTag();
      }
    },
    [tagInputModel, model, tags, hidePopover, handleAddTag]
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const targetValue = e.target.value;

      tagInputModel.setValue(targetValue);
    },
    [tagInputModel]
  );

  const handleDeleteTag = useCallback(
    ({ e, id }: { e: MouseEvent; id: string }) => {
      e.stopPropagation();

      const newTags = tags.filter(tag => tag.id !== id);
      setTags(newTags);
      model.setValue(newTags.map(tag => tag.value));
    },
    [tags, model]
  );

  const handleSelect = useCallback(
    (option: Option<string>) => {
      tagInputModel.value = option.label;

      handleAddTag();
    },
    [tagInputModel, handleAddTag]
  );

  return (
    <Root>
      {tags.map(tag => (
        <Tag key={tag.id} $valid={tag.valid}>
          <SpanWithEllipsis text={tag.value} />

          <DeleteIconWrapper onClick={e => handleDeleteTag({ e, id: tag.id })}>
            <DeleteIcon />
          </DeleteIconWrapper>
        </Tag>
      ))}

      <MyPopover
        key={rerenderPopoverKey}
        width={248}
        returnFocus
        withinPortal
        position="bottom-start"
        exitTransitionDuration={0}
        opened={popoverOpened && (recentsOptions.length > 0 || fromEntityOptions.length > 0)}
        Target={
          <TagInput
            autoFocus
            ref={inputRef}
            autoComplete="off"
            value={tagInputModel.value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        }
        hide={hidePopover}
      >
        <OptionsGroupsWrapper>
          {fromEntityOptions.length > 0 && (
            <OptionsGroup>
              <OptionGroupTitle>{t('from_card_or_linked_entities')}</OptionGroupTitle>

              <MyDropdownList
                noPadding
                maxHeight={LIST_MAX_HEIGHT}
                options={fromEntityOptions}
                highlight={tagInputModel.value}
                onSelect={handleSelect}
              />
            </OptionsGroup>
          )}

          {recentsOptions.length > 0 && (
            <OptionsGroup>
              <OptionGroupTitle>{t('recent')}</OptionGroupTitle>

              {filteredRecentOptions.length > 0 ? (
                <MyDropdownList
                  noPadding
                  options={recentsOptions}
                  maxHeight={LIST_MAX_HEIGHT}
                  filter={tagInputModel.value}
                  highlight={tagInputModel.value}
                  onSelect={handleSelect}
                />
              ) : (
                <MyDropdownList
                  noPadding
                  options={recentsOptions}
                  maxHeight={LIST_MAX_HEIGHT}
                  onSelect={handleSelect}
                />
              )}
            </OptionsGroup>
          )}
        </OptionsGroupsWrapper>
      </MyPopover>
    </Root>
  );
});

AddressMultiInput.displayName = 'AddressMultiInput';
export { AddressMultiInput };
