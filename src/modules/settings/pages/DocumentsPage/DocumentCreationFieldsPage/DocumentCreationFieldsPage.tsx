import { entityTypeStore } from '@/app';
import { useGetProductsSections } from '@/modules/products';
import { envUtil } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import styled from 'styled-components';
import { RequestSetupFormButton, SystemFieldType, type RussianCase } from '../../../shared';
import { SettingsPageTemplate } from '../../../templates';
import { EntityTypeSection, OrderSection, SystemSection } from './components';

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const DocumentCreationFieldsPage = observer(() => {
  const entityTypes = entityTypeStore.sortedEntityTypes;

  const { data: productsSections } = useGetProductsSections();

  useLayoutEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, []);

  const entityTypesWithSameName = useMemo<number[]>(() => {
    const entityTypesWithSameName: number[] = [];

    entityTypes.forEach(et => {
      entityTypes.forEach(et2 => {
        if (et.id !== et2.id && et.name === et2.name) entityTypesWithSameName.push(et.id);
      });
    });

    return entityTypesWithSameName;
  }, [entityTypes]);

  const generateCaseCode = useCallback((caseValue?: RussianCase): string => {
    return caseValue ? ` | case:'${caseValue}'` : '';
  }, []);

  const generateNumberToWordCode = useCallback((language?: string): string => {
    return language ? ` | words:'${language}'` : '';
  }, []);

  const generateSystemFieldCode = useCallback(
    ({
      entityTypeCode,
      systemFieldType,
      caseValue,
    }: {
      entityTypeCode: string;
      systemFieldType: SystemFieldType;
      caseValue?: RussianCase;
    }): string => {
      const caseCode = generateCaseCode(caseValue);

      switch (systemFieldType) {
        case SystemFieldType.OWNER:
          return `{${entityTypeCode}.owner${caseCode}}`;

        case SystemFieldType.NAME:
          return `{${entityTypeCode}.name${caseCode}}`;

        case SystemFieldType.CURRENT_DATE:
          return '{currentDate}';

        case SystemFieldType.DOCUMENT_NUMBER:
          return '{documentNumber}';
      }
    },
    [generateCaseCode]
  );

  const handleGenerateSystemFieldCode = useCallback(
    ({
      systemFieldType,
      caseValue,
    }: {
      systemFieldType: SystemFieldType;
      caseValue?: RussianCase;
    }) => generateSystemFieldCode({ entityTypeCode: '', systemFieldType, caseValue }),
    [generateSystemFieldCode]
  );

  return (
    <SettingsPageTemplate
      pageTitleKey="settings.document.creation"
      Controls={<RequestSetupFormButton titleKey="request_setup" />}
    >
      <List>
        <SystemSection generateSystemFieldCode={handleGenerateSystemFieldCode} />

        {entityTypes.map(et => (
          <EntityTypeSection
            key={et.id}
            entityType={et}
            sectionNameUnique={!entityTypesWithSameName.includes(et.id)}
            generateCaseCode={generateCaseCode}
            generateSystemFieldCode={generateSystemFieldCode}
            generateNumberToWordCode={generateNumberToWordCode}
          />
        ))}

        {envUtil.documentsShowOrderFields && productsSections && productsSections.length > 0 && (
          <OrderSection />
        )}
      </List>
    </SettingsPageTemplate>
  );
});

DocumentCreationFieldsPage.displayName = 'DocumentCreationFieldsPage';
export { DocumentCreationFieldsPage };
