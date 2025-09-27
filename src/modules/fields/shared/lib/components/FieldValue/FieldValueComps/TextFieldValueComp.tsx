import { dadataApi } from '@/app';
import {
  DadataSuggestionsType,
  debounce,
  envUtil,
  MyPopover,
  UrlUtil,
  useDropdownWidth,
  type DadataBankRequisitesSuggestion,
  type DadataOrgRequisitesSuggestion,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { LinkIcon } from '../../../../assets';
import type { FieldValueBaseProps, TextFieldValue } from '../../../models';
import { FieldLinkWrapper } from '../../FieldLinkWrapper/FieldLinkWrapper';
import { FieldTextInput } from '../../FieldTextInput/FieldTextInput';
import type { FieldTextPrimitiveRenderAs } from '../../FieldTextPrimitive/FieldTextPrimitive';
import { RequisitesSuggestions } from '../../RequisitesSuggestions/RequisitesSuggestions';
import { FieldValueTemplate } from '../FieldValueTemplate';

const FieldTextInputWrapper = styled.div`
  width: 100%;
`;

interface Props extends FieldValueBaseProps<TextFieldValue> {
  renderAs?: FieldTextPrimitiveRenderAs;
  isProjectFields?: boolean;
  onSelectBankRequisitesSuggestion?: (suggestion: DadataBankRequisitesSuggestion) => void;
  onSelectOrgRequisitesSuggestion?: (suggestion: DadataOrgRequisitesSuggestion) => void;
}

const POPOVER_MAX_WIDTH = 480;
const SUGGESTIONS_DELAY = 1000;

const TextFieldValueComp = observer((props: Props) => {
  const {
    field,
    readonly,
    tableView,
    fieldValue,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
    renderAs = 'input',
    isProjectFields,
    onChange,
    onSelectBankRequisitesSuggestion,
    onSelectOrgRequisitesSuggestion,
  } = props;

  const model = fieldValue.model;

  const url = UrlUtil.getUrlFromText(model.value);

  const [
    isSuggestionsPopoverOpened,
    { close: closeSuggestionsPopover, open: openSuggestionsPopover },
  ] = useDisclosure(false);

  const [suggestions, setSuggestions] = useState<
    DadataOrgRequisitesSuggestion[] | DadataBankRequisitesSuggestion[]
  >([]);
  const [suggestionsType, setSuggestionsType] = useState<Nullable<DadataSuggestionsType>>(null);

  const [areSuggestionsLoading, setAreSuggestionsLoading] = useState(false);

  const handleCloseSuggestionsPopover = useCallback(() => {
    setSuggestions([]);

    closeSuggestionsPopover();
  }, [closeSuggestionsPopover]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchBankRequisites = useCallback(
    debounce(async (value: string): Promise<void> => {
      if (!envUtil.appRUSegment) return;

      if (field.isBankRequisitesSearchableBy && value.trim().length > 2) {
        try {
          setAreSuggestionsLoading(true);
          setSuggestionsType(DadataSuggestionsType.BANK_REQUISITES);

          const bankRequisitesSuggestions = await dadataApi.getBankRequisites(value);

          if (bankRequisitesSuggestions.length > 0) {
            setSuggestions(bankRequisitesSuggestions);

            openSuggestionsPopover();
          } else {
            handleCloseSuggestionsPopover();
          }
        } catch (e) {
          setSuggestions([]);

          throw new Error(`Failed to get bank details suggestions: ${JSON.stringify(e)}`);
        } finally {
          setAreSuggestionsLoading(false);
        }
      }
    }, SUGGESTIONS_DELAY),
    [field, openSuggestionsPopover, closeSuggestionsPopover]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchOrgRequisites = useCallback(
    debounce(async (value: string): Promise<void> => {
      if (!envUtil.appRUSegment) return;

      if (field.isOrgRequisitesSearchableBy && value.trim().length > 2) {
        try {
          setAreSuggestionsLoading(true);
          setSuggestionsType(DadataSuggestionsType.ORG_REQUISITES);

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
    [field, openSuggestionsPopover, closeSuggestionsPopover]
  );

  const handleChange = useCallback(
    (value: string) => {
      debouncedSearchBankRequisites(value);
      debouncedSearchOrgRequisites(value);

      fieldValue.changeValue(value);

      onChange?.(fieldValue);
    },
    [fieldValue, onChange, debouncedSearchBankRequisites, debouncedSearchOrgRequisites]
  );

  const getSelectBankRequisitesSuggestionHandler = useCallback(
    (suggestion: DadataBankRequisitesSuggestion) => () => {
      onSelectBankRequisitesSuggestion?.(suggestion);

      closeSuggestionsPopover();
    },
    [onSelectBankRequisitesSuggestion, closeSuggestionsPopover]
  );

  const getSelectOrgRequisitesSuggestionHandler = useCallback(
    (suggestion: DadataOrgRequisitesSuggestion) => () => {
      onSelectOrgRequisitesSuggestion?.(suggestion);

      closeSuggestionsPopover();
    },
    [onSelectOrgRequisitesSuggestion, closeSuggestionsPopover]
  );

  const [width, ref] = useDropdownWidth();
  const popoverWidth = width * 1.5;

  return (
    <FieldValueTemplate
      tableView={tableView}
      settings={fieldSettings}
      filled={fieldValue.filled()}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <MyPopover
        withinPortal
        rootWidth="100%"
        position="bottom"
        opened={isSuggestionsPopoverOpened}
        width={popoverWidth > POPOVER_MAX_WIDTH ? POPOVER_MAX_WIDTH : popoverWidth}
        Target={
          <FieldTextInputWrapper ref={ref}>
            <FieldTextInput
              model={model}
              noActiveShadow
              readonly={readonly}
              loading={areSuggestionsLoading}
              renderAs={tableView ? 'input' : renderAs}
              // to allow project description  take up more space
              maxRows={isProjectFields ? 64 : undefined}
              lineClamp={isProjectFields ? 64 : undefined}
              Controls={
                url && (
                  <FieldLinkWrapper to={url} target="_blank">
                    <LinkIcon />
                  </FieldLinkWrapper>
                )
              }
              onChange={handleChange}
            />
          </FieldTextInputWrapper>
        }
        onOpen={openSuggestionsPopover}
        onClose={handleCloseSuggestionsPopover}
      >
        {suggestionsType && envUtil.appRUSegment && (
          <RequisitesSuggestions
            suggestions={suggestions}
            suggestionsType={suggestionsType}
            getSelectOrgRequisitesSuggestionHandler={getSelectOrgRequisitesSuggestionHandler}
            getSelectBankRequisitesSuggestionHandler={getSelectBankRequisitesSuggestionHandler}
          />
        )}
      </MyPopover>
    </FieldValueTemplate>
  );
});

TextFieldValueComp.displayName = 'TextFieldValueComp';
export { TextFieldValueComp };
