import { DocumentTemplateError } from '@/modules/card';
import {
  DocumentType,
  type CheckEntityDocumentResult,
  type DocumentTemplateInfo,
} from '@/modules/settings';
import {
  CheckboxModel,
  MyDrawer,
  MyDrawerHeaderTitle,
  PrimaryButton,
  SelectModel,
  WarningModal,
  useModalControl,
  type FileLink,
  type Nullable,
  type Option,
} from '@/shared';
import { Progress } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateDocumentsHint } from '../CreateDocumentsHint/CreateDocumentsHint';
import { GeneratedDocumentsList } from '../GeneratedDocumentsList/GeneratedDocumentsList';
import { SelectFormatsHint } from '../SelectFormatsHint/SelectFormatsHint';
import { CreateDocumentsDrawerContent } from './components';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 16px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface Props {
  entityId: number;
  templateInfos: DocumentTemplateInfo[];
  opened: boolean;
  entityDocuments: FileLink[];
  creating: boolean;
  isTemplateChecking: boolean;
  reloadFeed: () => void;
  showEmailModal: (selectedDocuments: FileLink[]) => void;
  getCreationSyntheticDelay: (types: DocumentType[]) => number;
  deleteDocument: (id: number) => Promise<void>;
  createDocuments: ({
    templateId,
    types,
    orderId,
  }: {
    templateId: number;
    types: DocumentType[];
    orderId?: Nullable<number>;
  }) => Promise<void>;
  checkTemplate: ({
    templateId,
    orderId,
  }: {
    templateId: number;
    orderId?: Nullable<number>;
  }) => Promise<CheckEntityDocumentResult>;
  hide: () => void;
}

interface InitialForm {
  templateInfo: SelectModel;
  formats: CheckboxModel;
  orderId: SelectModel;
}

const CreateDocumentsDrawer = observer((props: Props) => {
  const {
    entityId,
    templateInfos,
    opened,
    entityDocuments,
    creating,
    isTemplateChecking,
    reloadFeed,
    showEmailModal,
    getCreationSyntheticDelay,
    deleteDocument,
    createDocuments,
    checkTemplate,
    hide,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.create_documents',
  });

  const [templateChecked, setTemplateChecked] = useState(false);
  const [missingTags, setMissingTags] = useState<string[]>([]);

  const invalidDocumentTemplateWarningControl = useModalControl(false);

  const [creatingProgress, setCreatingProgress] = useState(0);

  const form = useLocalObservable<InitialForm>(() => ({
    orderId: SelectModel.create(),
    templateInfo: SelectModel.create(),
    formats: CheckboxModel.create([DocumentType.DOCX]).required(),
  }));

  const selectedDocumentsModel = useLocalObservable(() => CheckboxModel.create([]));

  const templateOptions = useMemo<Option<number>[]>(
    () =>
      templateInfos.map<Option<number>>(t => ({
        value: t.id,
        label: t.name,
      })),
    [templateInfos]
  );

  const handleCancel = useCallback(() => {
    form.formats.values = [];
    form.orderId = SelectModel.create();
    form.templateInfo = SelectModel.create();
  }, [form]);

  const handleClearTemplateCheckData = useCallback(() => {
    setTemplateChecked(false);
    setMissingTags([]);
  }, []);

  const handleCreateDocuments = useCallback(async (): Promise<void> => {
    if (!form.formats.validate()) return;

    const orderId = form.orderId.value;
    const templateId = form.templateInfo.value;

    if (!templateChecked) {
      try {
        const templateCheckResult = await checkTemplate({ templateId, orderId });

        setMissingTags(templateCheckResult.missingTags);
        setTemplateChecked(true);

        if (!templateCheckResult.isCorrect) return;
      } catch (e) {
        if (e instanceof DocumentTemplateError) {
          handleClearTemplateCheckData();

          return invalidDocumentTemplateWarningControl.open();
        } else {
          setTemplateChecked(true);
        }
      }
    }

    const types = form.formats.values;

    try {
      await createDocuments({ templateId, types, orderId });
    } catch (e) {
      if (e instanceof DocumentTemplateError) {
        invalidDocumentTemplateWarningControl.open();
      } else {
        console.error(`Failed to create documents for template ${templateId}: ${e}`);
      }
    }

    handleClearTemplateCheckData();
  }, [
    form.formats,
    form.orderId.value,
    form.templateInfo.value,
    templateChecked,
    handleClearTemplateCheckData,
    invalidDocumentTemplateWarningControl,
    checkTemplate,
    createDocuments,
  ]);

  useEffect(() => {
    if (!creating) return;

    const syntheticDelay = getCreationSyntheticDelay(form.formats.values);

    const interval = setInterval(() => {
      setCreatingProgress(prev => prev + 1);
    }, syntheticDelay / 100);

    return () => {
      clearInterval(interval);
      setCreatingProgress(0);
    };
  }, [creating, form.formats.values, getCreationSyntheticDelay]);

  const getHint = useCallback((): ReactNode => {
    if (templateOptions.length === 0)
      return (
        <CreateDocumentsHint
          title={t('hints.no_documents_title')}
          annotation={t('hints.no_documents_annotation')}
        />
      );

    if (creating)
      return (
        <CreateDocumentsHint
          title={t('hints.creating_documents_title')}
          annotation={t('hints.creating_documents_annotation')}
        >
          <Progress
            w="90%"
            animated
            value={creatingProgress}
            color="var(--button-text-green-default)"
          />
        </CreateDocumentsHint>
      );

    if (form.templateInfo.value)
      return (
        <SelectFormatsHint
          templateChecking={isTemplateChecking}
          model={form.formats}
          templateChecked={templateChecked}
          missingTags={missingTags}
          handleCancel={handleCancel}
          createDocuments={handleCreateDocuments}
        />
      );

    return (
      <CreateDocumentsHint
        title={t('hints.select_template_title')}
        annotation={t('hints.select_template_annotation')}
      />
    );
  }, [
    creating,
    missingTags,
    form.formats,
    templateChecked,
    creatingProgress,
    isTemplateChecking,
    templateOptions.length,
    form.templateInfo.value,
    handleCancel,
    handleCreateDocuments,
    t,
  ]);

  const handleShowEmailModal = useCallback(() => {
    showEmailModal(entityDocuments.filter(d => selectedDocumentsModel.values.includes(d.id)));
  }, [entityDocuments, selectedDocumentsModel.values, showEmailModal]);

  return (
    <>
      <MyDrawer
        opened={opened}
        Header={<MyDrawerHeaderTitle>{t('create_new_documents')}</MyDrawerHeaderTitle>}
        Controls={
          <Controls>
            <PrimaryButton
              disabled={!selectedDocumentsModel.values.length}
              onClick={handleShowEmailModal}
            >
              {t('send_by_email')}
            </PrimaryButton>
          </Controls>
        }
        hide={hide}
      >
        <Root>
          {opened && (
            <CreateDocumentsDrawerContent
              entityId={entityId}
              orderId={form.orderId}
              templateInfo={form.templateInfo}
              templateOptions={templateOptions}
              getHint={getHint}
              handleClearTemplateCheckData={handleClearTemplateCheckData}
            />
          )}

          {entityDocuments.length > 0 && (
            <GeneratedDocumentsList
              documents={entityDocuments}
              model={selectedDocumentsModel}
              reloadFeed={reloadFeed}
              onDelete={deleteDocument}
            />
          )}
        </Root>
      </MyDrawer>

      {invalidDocumentTemplateWarningControl.opened && (
        <WarningModal
          hideApprove
          icon="warning"
          height="fit-content"
          maxHeight="fit-content"
          title={t('invalid_template_title')}
          annotation={t('invalid_template_annotation')}
          isOpened={invalidDocumentTemplateWarningControl.opened}
          onClose={invalidDocumentTemplateWarningControl.close}
        />
      )}
    </>
  );
});

CreateDocumentsDrawer.displayName = 'CreateDocumentsDrawer';
export { CreateDocumentsDrawer };
