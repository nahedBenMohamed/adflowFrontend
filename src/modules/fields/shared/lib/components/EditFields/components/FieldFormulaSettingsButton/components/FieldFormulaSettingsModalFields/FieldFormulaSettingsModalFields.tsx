import { entityTypeStore } from '@/app';
import {
  AddSmallCircleButton,
  DropdownScrollbarMixin,
  FieldType,
  NoOptionsMessage,
  SpanWithEllipsis,
  TruncateMixin,
  type EntityType,
  type Nullable,
} from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { generateFormulaFieldCode } from '../../../../../../helpers';
import {
  FieldCode,
  FormulaFieldMathElementType,
  type Field,
  type FormulaKey,
} from '../../../../../../models';
import type { AppendMathElementHandler } from '../../../../../../types';
import { FormulaKeysButtons } from '../FormulaKeysButtons/FormulaKeysButtons';

const Root = styled.div`
  width: 100%;

  display: flex;
  gap: 20px;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const FieldsWrapper = styled.div`
  height: 280px;

  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;

  overflow-y: auto;
  background: var(--graphite-graphite-20);
  border-radius: var(--border-radius-element);

  transition: opacity var(--transition-duration) ease-in-out;
  animation: ${fadeIn} var(--transition-duration) ease-in-out;

  ${DropdownScrollbarMixin}

  padding: 16px;
`;

const KeysWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FieldSectionName = styled.div`
  width: 100%;

  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const FieldGroups = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px;
  border-radius: var(--border-radius-block);
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px 0px #eef4fe,
    0px 1px 2px 0px #d0daeb;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:not(:first-child) {
    padding-top: 12px;
    border-top: 1px solid var(--graphite-graphite-80);
  }
`;

const FieldGroupName = styled.div`
  width: 100%;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

const FieldBlock = styled.div`
  width: 100%;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

interface Props {
  fieldId: number;
  entityTypeId: number;
  formulaKeys: FormulaKey[];
  appendMathElement: AppendMathElementHandler;
}

const FORMULA_OR_NUMBER_OR_VALUE_FIELD_TYPE = [
  FieldType.VALUE,
  FieldType.NUMBER,
  FieldType.FORMULA,
];

const FieldFormulaSettingsModalFields = observer((props: Props) => {
  const { fieldId, entityTypeId, formulaKeys, appendMathElement } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields',
  });

  const entityType = entityTypeStore.getById(entityTypeId);
  const entityTypes = useMemo<EntityType[]>(
    () => [
      entityType,
      ...entityType.sortedLinkedEntityTypes.map<EntityType>(l =>
        entityTypeStore.getById(l.targetId)
      ),
    ],
    [entityType]
  );

  const getAddFieldHandler = useCallback(
    ({ entityTypeId, fieldId }: { entityTypeId: number; fieldId: number }) =>
      () => {
        const code = generateFormulaFieldCode({
          entityTypeId,
          fieldId,
        });

        appendMathElement({
          value: code,
          type: FormulaFieldMathElementType.FIELD,
        });
      },
    [appendMathElement]
  );

  return (
    <Root>
      <FieldsWrapper>
        {entityTypes.map(et => {
          const projectBudgetField: Nullable<Field> = et.isProjectCategory()
            ? (et.fields.find(f => f.code === FieldCode.VALUE) ?? null)
            : null;

          return (
            <FieldSection key={et.id}>
              <FieldSectionName>
                <SpanWithEllipsis text={et.section.name} />
              </FieldSectionName>

              <FieldGroups>
                {projectBudgetField && (
                  <FieldGroup>
                    <FieldBlock>
                      <SpanWithEllipsis
                        medium
                        text={t(`project_fields_block.${projectBudgetField.code}`)}
                      />

                      <AddSmallCircleButton
                        onClick={getAddFieldHandler({
                          entityTypeId: et.id,
                          fieldId: projectBudgetField.id,
                        })}
                      />
                    </FieldBlock>
                  </FieldGroup>
                )}

                {et.fieldGroups.map(fg => {
                  const groupFields = et
                    .getFieldsByFieldGroupId(fg.id)
                    .filter(
                      f =>
                        FORMULA_OR_NUMBER_OR_VALUE_FIELD_TYPE.includes(f.type) && f.id !== fieldId
                    );

                  return (
                    <FieldGroup key={fg.id}>
                      <FieldGroupName>
                        <SpanWithEllipsis medium text={fg.name} />
                      </FieldGroupName>

                      {groupFields.length > 0 ? (
                        groupFields.map(f => (
                          <FieldBlock key={f.id}>
                            <SpanWithEllipsis text={f.name} />

                            <AddSmallCircleButton
                              onClick={getAddFieldHandler({
                                fieldId: f.id,
                                entityTypeId: et.id,
                              })}
                            />
                          </FieldBlock>
                        ))
                      ) : (
                        <NoOptionsMessage>
                          {t(
                            'components.field_formula_settings_button.no_available_fields_for_formula'
                          )}
                        </NoOptionsMessage>
                      )}
                    </FieldGroup>
                  );
                })}
              </FieldGroups>
            </FieldSection>
          );
        })}
      </FieldsWrapper>

      <KeysWrapper>
        <FormulaKeysButtons formulaKeys={formulaKeys} />
      </KeysWrapper>
    </Root>
  );
});

FieldFormulaSettingsModalFields.displayName = 'FieldFormulaSettingsModalFields';
export { FieldFormulaSettingsModalFields };
