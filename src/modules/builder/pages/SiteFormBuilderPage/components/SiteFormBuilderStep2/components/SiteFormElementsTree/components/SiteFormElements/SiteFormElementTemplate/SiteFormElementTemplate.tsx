import { entityTypeStore } from '@/app';
import { FieldTextInput } from '@/modules/fields';
import {
  DeleteButton,
  DragFieldIcon,
  MyCheckboxWithBooleanModel,
  type BooleanModel,
} from '@/shared';
import type { DraggableProvided } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  SiteFormFieldTextView,
  SiteFormFieldType,
  type SiteFormElementsFieldModel,
  type SiteFormFieldEntityFieldModel,
  type SiteFormFieldEntityName,
} from '../../../../../../../../../shared';

const Root = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TopBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const LabelInputWrapper = styled.div`
  padding: 0 32px;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  flex: 1;
`;

const CheckboxesWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 0 32px;
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  padding: 0 32px;
`;

const Info = styled.p`
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-primary-text);

  strong {
    font-weight: 500;
    color: var(--graphite-graphite-840);
  }
`;

interface Props {
  children: ReactNode;
  fieldLabelEnabled: boolean;
  field: SiteFormElementsFieldModel;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  hideLabel?: boolean;
  withoutCheckboxes?: boolean;
  onDelete?: () => void;
}

interface CheckboxesVisibilityState {
  hasRequiredCheckbox: boolean;
  hasValidationCheckbox: boolean;
}

const SiteFormElementTemplate = observer((props: Props) => {
  const { children, fieldLabelEnabled, field, dragHandleProps, withoutCheckboxes, onDelete } =
    props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.tree.entity_field_element.template',
  });

  const getFieldTypeLabel = useCallback(
    (fieldType: SiteFormFieldType): string => {
      switch (fieldType) {
        case SiteFormFieldType.ENTITY_NAME: {
          const settings = field.settings as SiteFormFieldEntityName;

          const entityType = entityTypeStore.getById(settings.entityTypeId);

          if (entityType.isCompanyCategory()) return `${t('company_name')} ${entityType.name}`;

          if (entityType.isContactCategory()) return `${t('contact_name')} ${entityType.name}`;

          return t('card_name');
        }

        case SiteFormFieldType.ENTITY_FIELD: {
          const settings = field.settings as SiteFormFieldEntityFieldModel;
          const meta = settings.meta;

          if (meta?.view)
            return meta.view === SiteFormFieldTextView.INPUT ? t('short_text') : t('long_text');

          return `${t('field')} ${entityTypeStore.getById(settings.entityTypeId).getFieldById(settings.fieldId).name}`;
        }

        case SiteFormFieldType.DELIMITER:
          return t('delimiter');

        case SiteFormFieldType.FILE:
          return t('file');

        case SiteFormFieldType.SCHEDULE:
          return t('schedule');

        case SiteFormFieldType.SCHEDULE_PERFORMER:
          return t('schedule_performer');

        case SiteFormFieldType.SCHEDULE_DATE:
          return t('schedule_date');

        case SiteFormFieldType.SCHEDULE_TIME:
          return t('schedule_time');
      }
    },
    [field, t]
  );

  const { hasValidationCheckbox, hasRequiredCheckbox } = useMemo<CheckboxesVisibilityState>(
    () => ({
      hasValidationCheckbox: Boolean(
        !withoutCheckboxes &&
          field.settings &&
          field.type === SiteFormFieldType.ENTITY_FIELD &&
          (field.settings as SiteFormFieldEntityFieldModel).isValidationRequired
      ),
      hasRequiredCheckbox: Boolean(!withoutCheckboxes && field.isRequired),
    }),
    [withoutCheckboxes, field.settings, field.type, field.isRequired]
  );

  const entityTypeId = field.settings?.entityTypeId;

  return (
    <Root>
      <TopBlockWrapper>
        {fieldLabelEnabled && (
          <LabelInputWrapper>
            <FieldTextInput model={field.label} placeholder={t('placeholder')} />
          </LabelInputWrapper>
        )}

        <ContentWrapper>
          <IconWrapper {...dragHandleProps}>
            <DragFieldIcon />
          </IconWrapper>

          <Content>{children}</Content>

          <IconWrapper>{onDelete && <DeleteButton size="medium" onClick={onDelete} />}</IconWrapper>
        </ContentWrapper>
      </TopBlockWrapper>

      {(hasRequiredCheckbox || hasValidationCheckbox) && (
        <CheckboxesWrapper>
          {hasRequiredCheckbox && (
            <CheckboxWrapper>
              <MyCheckboxWithBooleanModel
                variant="bigger"
                model={field.isRequired as BooleanModel}
              />
              {t('required')}
            </CheckboxWrapper>
          )}

          {hasValidationCheckbox && (
            <CheckboxWrapper>
              <MyCheckboxWithBooleanModel
                variant="bigger"
                model={
                  (field.settings as SiteFormFieldEntityFieldModel)
                    .isValidationRequired as BooleanModel
                }
              />
              {t('validation')}
            </CheckboxWrapper>
          )}
        </CheckboxesWrapper>
      )}

      <InfoRow>
        <Info>
          {t('field_type')} <strong>{getFieldTypeLabel(field.type)}</strong>
        </Info>

        {entityTypeId && (
          <Info>
            {t('linked_with')} <strong>{entityTypeStore.getById(entityTypeId).name}</strong>
          </Info>
        )}
      </InfoRow>
    </Root>
  );
});

SiteFormElementTemplate.displayName = 'SiteFormElementTemplate';
export { SiteFormElementTemplate };
