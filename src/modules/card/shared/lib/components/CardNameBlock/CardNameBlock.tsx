import { dadataApi, entityTypeStore } from '@/app';
import { RequisitesSuggestions } from '@/modules/fields';
import { findChatWithProviderTransport, type Chat, type ChatProvider } from '@/modules/multichat';
import {
  CardCopiedCountTag,
  DadataSuggestionsType,
  debounce,
  envUtil,
  MyInput,
  MyPopover,
  TruncateMixin,
  useDropdownWidth,
  type DadataOrgRequisitesSuggestion,
  type InputModel,
  type Nullable,
} from '@/shared';
import { Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';
import { useGetChatTags } from '../../hooks';
import type { FindChatHandler } from '../../types';
import { MessengerTag } from '../MessengerTag/MessengerTag';

const Root = styled.div`
  flex: 1;
  display: flex;

  ${TruncateMixin}
`;

const InputWrapper = styled.div`
  width: 100%;

  input {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    color: var(--graphite-graphite-840);

    padding-bottom: 1px;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

const Name = styled.span<{ $disabled: boolean }>`
  font-size: 16px;
  font-weight: 600;
  line-height: 20px;
  text-align: right;
  color: var(--graphite-graphite-840);

  //to prevent bounce when entering edit mode
  padding-bottom: 1px;

  ${p =>
    !p.$disabled &&
    css`
      &:hover {
        cursor: pointer;
      }
    `}

  ${TruncateMixin}
`;

interface Props {
  saving: boolean;
  isAfterAdd: boolean;
  editMode: boolean;
  disabled: boolean;
  model: InputModel;
  copiedFrom: Nullable<number>;
  copiedCount: Nullable<number>;
  entityTypeId: number;
  currentPageEncodedUrl: string;
  chats?: Chat[];
  providers?: ChatProvider[];
  hideEditMode: () => void;
  showEditMode: () => void;
  onSelectOrgRequisitesSuggestion: (suggestion: DadataOrgRequisitesSuggestion) => void;
}

const SUGGESTIONS_DELAY = 1000;

const CardNameBlock = observer((props: Props) => {
  const {
    saving,
    isAfterAdd,
    editMode,
    disabled,
    model,
    copiedFrom,
    copiedCount,
    entityTypeId,
    currentPageEncodedUrl,
    chats,
    providers,
    hideEditMode,
    showEditMode,
    onSelectOrgRequisitesSuggestion,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card',
  });

  const ref = useRef<HTMLInputElement>(null);
  const inputTouched = useRef<boolean>(false);

  const entityType = entityTypeStore.getById(entityTypeId);

  const [
    isSuggestionsPopoverOpened,
    { close: closeSuggestionsPopover, open: openSuggestionsPopover },
  ] = useDisclosure(false);
  const [suggestions, setSuggestions] = useState<DadataOrgRequisitesSuggestion[]>([]);

  const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchOrgRequisites = useCallback(
    debounce(async (value: string): Promise<void> => {
      if (!envUtil.appRUSegment) return;

      if (entityType.isCompanyCategory() && value.trim().length > 2) {
        try {
          setAreSuggestionsLoading(true);

          const orgRequisitesSuggestions = await dadataApi.getOrgRequisites(value);

          if (orgRequisitesSuggestions.length > 0) {
            setSuggestions(orgRequisitesSuggestions);

            openSuggestionsPopover();
          } else {
            handleCloseSuggestionsPopover();
          }
        } catch (e) {
          setSuggestions([]);

          throw new Error(
            `Failed to get organization requisites suggestions: ${JSON.stringify(e)}`
          );
        } finally {
          setAreSuggestionsLoading(false);
        }
      }
    }, SUGGESTIONS_DELAY),
    [openSuggestionsPopover, closeSuggestionsPopover]
  );

  const handleChange = useCallback(
    (value: string) => debouncedSearchOrgRequisites(value),
    [debouncedSearchOrgRequisites]
  );

  const handleCloseSuggestionsPopover = useCallback(() => {
    setSuggestions([]);

    closeSuggestionsPopover();
  }, [closeSuggestionsPopover]);

  const getSelectOrgRequisitesSuggestionHandler = useCallback(
    (suggestion: DadataOrgRequisitesSuggestion) => () => {
      onSelectOrgRequisitesSuggestion(suggestion);

      closeSuggestionsPopover();
    },
    [onSelectOrgRequisitesSuggestion, closeSuggestionsPopover]
  );

  useEffect(() => {
    if (inputTouched.current) return;

    if (isAfterAdd && editMode && ref.current) {
      ref.current.select();

      inputTouched.current = true;
    }
  }, [editMode, isAfterAdd, inputTouched]);

  const handleFindChat = useCallback<FindChatHandler>(
    t =>
      findChatWithProviderTransport({
        chats,
        providers,
        transport: t,
      }),
    [chats, providers]
  );

  const chatTags = useGetChatTags(handleFindChat);

  const [popoverWidth, wrapperRef] = useDropdownWidth();

  useOnClickOutside(wrapperRef as RefObject<HTMLDivElement>, () => {
    if (!editMode) return;

    if (model.validate() && !isSuggestionsPopoverOpened) hideEditMode();
  });

  return (
    <Root>
      {editMode && !disabled ? (
        <MyPopover
          withinPortal
          rootWidth="100%"
          position="bottom"
          width={popoverWidth}
          opened={isSuggestionsPopoverOpened}
          Target={
            <InputWrapper ref={wrapperRef}>
              <MyInput
                ref={ref}
                autoFocus
                model={model}
                disabled={saving}
                whitespaceClearing
                loading={areSuggestionsLoading}
                placeholder={t('placeholders.name')}
                handleChange={handleChange}
              />
            </InputWrapper>
          }
          onOpen={openSuggestionsPopover}
          onClose={handleCloseSuggestionsPopover}
        >
          {envUtil.appRUSegment && entityType.isCompanyCategory() && (
            <RequisitesSuggestions
              suggestions={suggestions}
              suggestionsType={DadataSuggestionsType.ORG_REQUISITES}
              getSelectOrgRequisitesSuggestionHandler={getSelectOrgRequisitesSuggestionHandler}
            />
          )}
        </MyPopover>
      ) : (
        <NameWrapper>
          <Name
            $disabled={disabled}
            title={model.value}
            onClick={disabled ? undefined : showEditMode}
          >
            {model.value}
          </Name>

          <Tooltip.Group>
            {chatTags.map(
              ({ chat, transport }) =>
                chat && (
                  <MessengerTag
                    key={chat.id}
                    chatId={chat.id}
                    providerId={chat.providerId}
                    providerTransport={transport}
                  />
                )
            )}
          </Tooltip.Group>

          {copiedFrom && copiedCount && (
            <CardCopiedCountTag
              copiedFrom={copiedFrom}
              copiedCount={copiedCount}
              entityTypeId={entityTypeId}
              from={currentPageEncodedUrl}
            />
          )}
        </NameWrapper>
      )}
    </Root>
  );
});

CardNameBlock.displayName = 'CardNameBlock';
export { CardNameBlock };
