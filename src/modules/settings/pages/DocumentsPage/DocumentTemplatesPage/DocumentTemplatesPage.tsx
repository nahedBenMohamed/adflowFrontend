import { appStore } from '@/app';
import { RequestSetupFormButton } from '@/modules/settings';
import { NotFoundIcon } from '@/shared';
import { when } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DocumentTemplateStore } from '../../../store';
import { SettingsPageTemplate } from '../../../templates';
import {
  AddDocumentTemplateButton,
  DocumentTemplateItem,
  DocumentTemplateItemSkeleton,
} from './components';

const Root = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding-bottom: 16px;
`;

const NoDocumentTemplatesBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: var(--button-text-graphite-secondary-text);

  padding: 40px 8px;
`;

const DocumentTemplatesPage = observer(() => {
  const documentTemplatesStore = useMemo(() => new DocumentTemplateStore(), []);

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.templates.document_templates_page',
  });

  const {
    areLoaded,
    isAdding,
    documentTemplates,
    loadData,
    addDocumentTemplate,
    deleteDocumentTemplate,
    updateDocumentTemplate,
  } = documentTemplatesStore;

  useEffect(() => {
    when(
      () => appStore.isLoaded,
      () => loadData()
    );
  }, [loadData]);

  return (
    <SettingsPageTemplate
      pageTitleKey="settings.document.templates"
      Controls={
        <>
          <AddDocumentTemplateButton adding={isAdding} onAddTemplate={addDocumentTemplate} />

          <RequestSetupFormButton titleKey="request_setup" />
        </>
      }
    >
      <Root>
        {areLoaded ? (
          documentTemplates.length > 0 ? (
            documentTemplates.map((dt, idx) => (
              <DocumentTemplateItem
                key={dt.id}
                template={dt}
                defaultControlsVisible={idx === 0}
                onDeleteTemplate={() => deleteDocumentTemplate(dt.id)}
                onUpdateTemplate={dto => updateDocumentTemplate({ id: dt.id, dto })}
              />
            ))
          ) : (
            <NoDocumentTemplatesBlock>
              {t('no_document_templates')}
              <br />
              {t('can_create_new_there')}

              <NotFoundIcon />
            </NoDocumentTemplatesBlock>
          )
        ) : (
          new Array(4)
            .fill(0)
            .map((_, idx) => <DocumentTemplateItemSkeleton key={idx} $delay={idx * 300} />)
        )}
      </Root>
    </SettingsPageTemplate>
  );
});

DocumentTemplatesPage.displayName = 'DocumentTemplatesPage';
export { DocumentTemplatesPage };
