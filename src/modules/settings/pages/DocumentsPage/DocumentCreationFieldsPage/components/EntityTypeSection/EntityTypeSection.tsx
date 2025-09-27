import { generalSettingsStore } from '@/app';
import { FieldsStore, type Field } from '@/modules/fields';
import { Language, type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { SystemFieldType, removeSpecialChars, type RussianCase } from '../../../../../shared';
import { SystemFieldBlock } from '../FieldBlock/SystemFieldBlock';
import { FieldGroupSection } from '../FieldGroupSection/FieldGroupSection';
import { ProjectFieldsBlock } from '../ProjectFieldsBlock/ProjectFieldsBlock';
import { SectionTemplate } from '../SectionTemplate/SectionTemplate';

export const Root = styled.li`
  display: grid;
  grid-template-columns: calc(30% - 8px) calc(70% - 8px);
  gap: 16px;
`;

export const SectionNameBlock = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-priory-text);

  padding-top: 8px;
  word-break: break-all;
  border-top: 1px solid var(--graphite-graphite-80);
`;

export const SystemFieldsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldsBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 24px;
  background: var(--primary-statuses-white-0);
  box-shadow:
    0px 0px 2px #eef4fe,
    0px 1px 2px #d0daeb;
  border-radius: var(--border-radius-block);
`;

interface Props {
  entityType: EntityType;
  sectionNameUnique: boolean;
  generateCaseCode: (caseValue?: RussianCase) => string;
  generateNumberToWordCode: (language?: string) => string;
  generateSystemFieldCode: ({
    entityTypeCode,
    systemFieldType,
    caseValue,
  }: {
    entityTypeCode: string;
    systemFieldType: SystemFieldType;
    caseValue?: RussianCase;
  }) => string;
}

const EntityTypeSection = observer((props: Props) => {
  const {
    entityType,
    sectionNameUnique,
    generateCaseCode,
    generateNumberToWordCode,
    generateSystemFieldCode,
  } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_creation_fields_page.ui.entity_type_section',
  });

  const { fields, id } = entityType;

  const fieldsStore = useMemo(() => new FieldsStore({ initialFields: fields }), [fields]);

  const fieldsWithSameName = useMemo<number[]>(() => {
    const fieldsWithSameName: number[] = [];

    fields.forEach(f1 => {
      fields.forEach(f2 => {
        if (f1.id !== f2.id && f1.name === f2.name) fieldsWithSameName.push(f1.id);
      });
    });

    return fieldsWithSameName;
  }, [fields]);

  const entityTypeCode = useMemo<string>(() => {
    const entityTypeNameParsed = removeSpecialChars(entityType.name);

    if (!sectionNameUnique) return `${entityTypeNameParsed}${id}`;

    return entityTypeNameParsed;
  }, [entityType, id, sectionNameUnique]);

  const generateFieldCode = ({
    field,
    caseValue,
    numberToWord,
  }: {
    field: Field;
    caseValue?: RussianCase;
    numberToWord?: string;
  }): string => {
    const isFieldNameUnique = !fieldsWithSameName.includes(field.id);
    const fieldNameWithoutSlashes = removeSpecialChars(field.name);

    const suffix = caseValue ? generateCaseCode(caseValue) : generateNumberToWordCode(numberToWord);

    if (isFieldNameUnique) return `{${entityTypeCode}.${fieldNameWithoutSlashes}${suffix}}`;

    return `{${entityTypeCode}.${fieldNameWithoutSlashes}${field.id}${suffix}}`;
  };

  const isProject = entityType.isProjectCategory();

  const isRussianLocale = generalSettingsStore.accountSettings?.language === Language.RUSSIAN;

  const handleGenerateSystemFieldCode = useCallback(
    ({
      systemFieldType,
      caseValue,
    }: {
      systemFieldType: SystemFieldType;
      caseValue?: RussianCase;
    }) => generateSystemFieldCode({ entityTypeCode, systemFieldType, caseValue }),
    [entityTypeCode, generateSystemFieldCode]
  );

  return (
    <SectionTemplate
      name={entityType.section.name}
      SystemFields={
        <>
          <SystemFieldBlock
            name={t('name')}
            isRussianLocale={isRussianLocale}
            systemFieldType={SystemFieldType.NAME}
            generateSystemFieldCode={handleGenerateSystemFieldCode}
          />

          <SystemFieldBlock
            name={t('owner')}
            isRussianLocale={isRussianLocale}
            systemFieldType={SystemFieldType.OWNER}
            generateSystemFieldCode={handleGenerateSystemFieldCode}
          />

          {isProject && (
            <ProjectFieldsBlock
              fieldsStore={fieldsStore}
              isRussianLocale={isRussianLocale}
              generateFieldCode={generateFieldCode}
            />
          )}
        </>
      }
      Fields={entityType.fieldGroups.map(fg => (
        <FieldGroupSection
          key={fg.id}
          fieldGroup={fg}
          fieldsStore={fieldsStore}
          isRussianLocale={isRussianLocale}
          generateFieldCode={generateFieldCode}
        />
      ))}
    />
  );
});

EntityTypeSection.displayName = 'EntityTypeSection';
export { EntityTypeSection };
