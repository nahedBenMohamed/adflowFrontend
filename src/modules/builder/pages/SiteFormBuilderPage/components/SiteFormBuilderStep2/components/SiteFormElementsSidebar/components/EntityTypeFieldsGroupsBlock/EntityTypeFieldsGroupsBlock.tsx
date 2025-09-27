import type { Field } from '@/modules/fields';
import {
  AddSmallCircleButton,
  SpanWithEllipsis,
  TruncateMixin,
  type EntityType,
  type FieldType,
  type Nullable,
} from '@/shared';
import { useCallback } from 'react';
import styled from 'styled-components';
import type {
  AddSiteFormFieldHandler,
  AddSiteFormFieldHandlerArgs,
  SiteFormElementsFieldModel,
  SiteFormFieldEntityFieldModel,
  SiteFormFieldTextMeta,
} from '../../../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const FieldGroupBlock = styled.ul`
  width: 100%;

  display: flex;
  flex-direction: column;

  ${TruncateMixin}
`;

const FieldGroupName = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 8px;
`;

const FieldItem = styled.li`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 4px 8px 6px;

  ${TruncateMixin}
`;

interface Props {
  et: EntityType;
  fieldType: FieldType;
  entityTypeId: number;
  entityTypeFieldsModels: SiteFormElementsFieldModel[];
  meta?: SiteFormFieldTextMeta;
  isFieldShown: (f: Field) => boolean;
  handleAddField: AddSiteFormFieldHandler;
}

const EntityTypeFieldsGroupsBlock = (props: Props) => {
  const {
    et,
    fieldType,
    entityTypeId,
    entityTypeFieldsModels,
    meta,
    isFieldShown,
    handleAddField,
  } = props;

  const getAddFieldHandler = useCallback(
    (args: AddSiteFormFieldHandlerArgs) => () => handleAddField(args),
    [handleAddField]
  );

  return (
    <Root>
      {et.fieldGroups.map(fg => {
        const fields = et
          .getFieldsByFieldGroupId(fg.id)
          .filter(f => f.type === fieldType && isFieldShown(f));

        // we can only have one example of each entity type field per form
        const hasNonExistentFields = fields.some(
          f =>
            !entityTypeFieldsModels.find(
              fm => (fm.settings as Nullable<SiteFormFieldEntityFieldModel>)?.fieldId === f.id
            )
        );

        if (!hasNonExistentFields) return null;

        return fields.length > 0 ? (
          <FieldGroupBlock key={fg.id}>
            <FieldGroupName>
              <SpanWithEllipsis text={fg.name} />
            </FieldGroupName>

            {fields.map(f => {
              const alreadyExists = entityTypeFieldsModels.find(
                fm => (fm.settings as Nullable<SiteFormFieldEntityFieldModel>)?.fieldId === f.id
              );

              if (alreadyExists) return null;

              return (
                <FieldItem key={f.id}>
                  <SpanWithEllipsis text={f.name} />

                  <AddSmallCircleButton
                    bigger
                    onClick={getAddFieldHandler({
                      meta,
                      fieldType,
                      entityTypeId,
                      fieldId: f.id,
                      fieldLabel: f.name,
                    })}
                  />
                </FieldItem>
              );
            })}
          </FieldGroupBlock>
        ) : null;
      })}
    </Root>
  );
};

export { EntityTypeFieldsGroupsBlock };
