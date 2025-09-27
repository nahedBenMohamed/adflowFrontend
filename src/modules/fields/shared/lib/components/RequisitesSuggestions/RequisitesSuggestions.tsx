import {
  capitalizeFirstLetter,
  DadataSuggestionsType,
  DropdownScrollbarMixin,
  SpanWithEllipsis,
  TruncateMixin,
  type DadataBankRequisitesSuggestion,
  type DadataOrgRequisitesSuggestion,
} from '@/shared';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SuggestionsList = styled.ul`
  width: 100%;
  max-height: 320px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  ${DropdownScrollbarMixin}

  padding: 8px 12px;
`;

const SuggestionItem = styled.li`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 6px 8px;
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: #f3fded;
  }
`;

const SuggestionItemTitle = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

const SuggestionAnnotationsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SuggestionItemAnnotation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-graphite-secondary-text);

  b {
    font-weight: 600;
  }

  ${TruncateMixin}
`;

interface Props {
  suggestionsType: DadataSuggestionsType;
  suggestions: DadataOrgRequisitesSuggestion[] | DadataBankRequisitesSuggestion[];
  getSelectOrgRequisitesSuggestionHandler: (
    suggestion: DadataOrgRequisitesSuggestion
  ) => () => void;
  getSelectBankRequisitesSuggestionHandler?: (
    suggestion: DadataBankRequisitesSuggestion
  ) => () => void;
}

const RequisitesSuggestions = (props: Props) => {
  const {
    suggestionsType,
    suggestions,
    getSelectOrgRequisitesSuggestionHandler,
    getSelectBankRequisitesSuggestionHandler,
  } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.field_value',
  });

  const renderOrgContent = useCallback(
    (s: DadataOrgRequisitesSuggestion) => {
      return (
        <>
          <SuggestionItemTitle>
            {s.name?.short || s.value || s.unrestrictedValue}
          </SuggestionItemTitle>

          <SuggestionAnnotationsWrapper>
            {s.ogrn && (
              <SuggestionItemAnnotation>
                <p>
                  <b>{t('ogrn')}:</b> <SpanWithEllipsis text={s.ogrn} />
                </p>
              </SuggestionItemAnnotation>
            )}

            {s.management?.name && s.management?.post && (
              <SuggestionItemAnnotation>
                <b>
                  <SpanWithEllipsis text={s.management.name} />
                </b>

                <SpanWithEllipsis
                  text={capitalizeFirstLetter(s.management.post.toLocaleLowerCase())}
                />
              </SuggestionItemAnnotation>
            )}
          </SuggestionAnnotationsWrapper>
        </>
      );
    },
    [t]
  );

  const renderBankContent = useCallback(
    (s: DadataBankRequisitesSuggestion) => {
      return (
        <>
          <SuggestionItemTitle>{s.value || s.unrestrictedValue}</SuggestionItemTitle>

          <SuggestionAnnotationsWrapper>
            {s.inn && (
              <SuggestionItemAnnotation>
                <p>
                  <b>{t('tin')}:</b> <SpanWithEllipsis text={s.inn} />
                </p>
              </SuggestionItemAnnotation>
            )}

            {s.kpp && (
              <SuggestionItemAnnotation>
                <p>
                  <b>{t('trrc')}:</b> <SpanWithEllipsis text={s.kpp} />
                </p>
              </SuggestionItemAnnotation>
            )}
          </SuggestionAnnotationsWrapper>
        </>
      );
    },
    [t]
  );

  const isBankRequisitesSuggestion = suggestionsType === DadataSuggestionsType.BANK_REQUISITES;
  const isOrgRequisitesSuggestion = suggestionsType === DadataSuggestionsType.ORG_REQUISITES;

  return (
    <SuggestionsList>
      {suggestionsType &&
        suggestions
          ?.filter(s => s.value)
          .map(
            s =>
              s.value && (
                <SuggestionItem
                  key={s.value + s.inn + s.kpp}
                  onClick={
                    isBankRequisitesSuggestion
                      ? getSelectBankRequisitesSuggestionHandler?.(s)
                      : isOrgRequisitesSuggestion
                        ? getSelectOrgRequisitesSuggestionHandler(s)
                        : undefined
                  }
                >
                  {isBankRequisitesSuggestion && renderBankContent(s)}

                  {isOrgRequisitesSuggestion && renderOrgContent(s)}
                </SuggestionItem>
              )
          )}
    </SuggestionsList>
  );
};

export { RequisitesSuggestions };
