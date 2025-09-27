import { entityTypeStore } from '@/app';
import type { Field } from '@/modules/fields';
import { SpanWithEllipsis, TruncateMixin, type FieldType, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  type AddSiteFormFieldHandler,
  type SiteFormElementsFieldModel,
  type SiteFormFieldEntityFieldModel,
  type SiteFormFieldTextMeta,
} from '../../../../../../../../shared';
import { EntityTypeBlockTemplate } from '../EntityTypeBlockTemplate/EntityTypeBlockTemplate';
import { EntityTypeFieldsGroupsBlock } from '../EntityTypeFieldsGroupsBlock/EntityTypeFieldsGroupsBlock';
import { FormElementCollapsibleBlock } from '../FormElementCollapsibleBlock/FormElementCollapsibleBlock';

const EmptyBlock = styled.div`
  width: 100%;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 12px 8px 16px;

  ${TruncateMixin}
`;

interface Props {
  title: string;
  Icon: ReactNode;
  opened: boolean;
  fieldType: FieldType;
  entityTypeIds: number[];
  entityTypesFieldsModels: SiteFormElementsFieldModel[];
  meta?: SiteFormFieldTextMeta;
  hideAnalyticsFields?: boolean;
  onButtonClick: () => void;
  handleAddField: AddSiteFormFieldHandler;
}

const FormElementFieldBlock = observer((props: Props) => {
  const {
    title,
    Icon,
    opened,
    fieldType,
    entityTypeIds,
    entityTypesFieldsModels,
    meta,
    hideAnalyticsFields,
    onButtonClick,
    handleAddField,
  } = props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.sidebar.field_elements',
  });

  const isFieldShown = useCallback(
    (f: Field) => (hideAnalyticsFields ? !f.isAnalyticsField : true),
    [hideAnalyticsFields]
  );

  return (
    <FormElementCollapsibleBlock opened={opened} title={title} Icon={Icon} onClick={onButtonClick}>
      {entityTypeIds.map(etId => {
        const et = entityTypeStore.getById(etId);

        // we can use only one entity type field per form
        const hasFields = et.fields.find(
          f =>
            f.type === fieldType &&
            isFieldShown(f) &&
            !entityTypesFieldsModels.find(
              fm =>
                (fm.settings as Nullable<SiteFormFieldEntityFieldModel>)?.fieldId === f.id &&
                fm.settings?.entityTypeId === etId
            )
        );

        const hasNonEmptyFieldsGroups = et.fieldGroups.find(fg =>
          et
            .getFieldsByFieldGroupId(fg.id)
            .some(
              f =>
                !entityTypesFieldsModels.find(
                  fm =>
                    (fm.settings as Nullable<SiteFormFieldEntityFieldModel>)?.fieldId === f.id &&
                    fm.settings?.entityTypeId === etId
                )
            )
        );

        return (
          <EntityTypeBlockTemplate key={et.id} et={et}>
            {hasFields && hasNonEmptyFieldsGroups ? (
              <EntityTypeFieldsGroupsBlock
                et={et}
                meta={meta}
                entityTypeId={et.id}
                fieldType={fieldType}
                entityTypeFieldsModels={entityTypesFieldsModels.filter(
                  fm => fm.settings?.entityTypeId === et.id
                )}
                isFieldShown={isFieldShown}
                handleAddField={handleAddField}
              />
            ) : (
              <EmptyBlock>
                <SpanWithEllipsis text={t('no_available_fields')} />
              </EmptyBlock>
            )}
          </EntityTypeBlockTemplate>
        );
      })}
    </FormElementCollapsibleBlock>
  );
});

FormElementFieldBlock.displayName = 'FormElementFieldBlock';
export { FormElementFieldBlock };
