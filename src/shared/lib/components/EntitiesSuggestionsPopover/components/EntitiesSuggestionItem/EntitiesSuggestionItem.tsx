import { userStore } from '@/app';
import type { MultitextFieldValue } from '@/modules/fields';
import { useCallback } from 'react';
import styled, { css } from 'styled-components';
import { TruncateMixin } from '../../../../mixins';
import type { Entity, FieldType, Option } from '../../../../models';
import type { Nullable } from '../../../../types';
import { AvatarCircle } from '../../../AvatarCircle/AvatarCircle';
import { TextHighlighter } from '../../../TextHighlighter/TextHighlighter';

const Root = styled.li<{ $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 8px 8px 12px;
  border-bottom: 1px solid var(--graphite-graphite-80);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background-color: var(--graphite-graphite-40);
  }

  &:last-child {
    border-bottom: none;
  }

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.5;
    `}
`;

const SuggestionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SuggestionTitle = styled.p`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const SuggestionOwner = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const FieldContent = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

export type DuplicateSuggestionType = FieldType.PHONE | FieldType.EMAIL;

interface Props {
  entity: Entity;
  disabled: boolean;
  suggestionType: DuplicateSuggestionType;
  search: Nullable<string>;
  changeEntityCb: () => void;
}

const EntitiesSuggestionItem = (props: Props) => {
  const { entity, disabled, suggestionType, search, changeEntityCb } = props;

  const getEligibleFields = useCallback((): Option<string>[] => {
    const eligibleFields: Option<string>[] = [];

    entity.fieldValues.forEach(fv => {
      if (fv.fieldType !== suggestionType || !search) return;

      (fv as MultitextFieldValue).values.forEach((v, idx) => {
        if (v.includes(search))
          eligibleFields.push({
            label: v,
            value: `${fv.fieldId}-${idx}`,
          });
      });
    });

    return eligibleFields;
  }, [entity.fieldValues, search, suggestionType]);

  const responsibleUser = userStore.getById(entity.responsibleUserId);

  return (
    <Root onClick={disabled ? undefined : changeEntityCb} $disabled={disabled}>
      <SuggestionHeader>
        <SuggestionTitle>{entity.name}</SuggestionTitle>

        {getEligibleFields().map(f => (
          <FieldContent key={f.value}>
            <TextHighlighter truncate str={f.label} filter={search} />
          </FieldContent>
        ))}
      </SuggestionHeader>

      <SuggestionOwner>
        <AvatarCircle avatar={responsibleUser.getAvatar()} />

        {responsibleUser.fullName}
      </SuggestionOwner>
    </Root>
  );
};

export { EntitiesSuggestionItem };
