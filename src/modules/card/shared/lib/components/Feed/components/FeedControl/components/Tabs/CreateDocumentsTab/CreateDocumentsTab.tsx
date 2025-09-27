import {
  CheckDocumentDto,
  CreateDocumentDto,
  type CheckEntityDocumentResult,
  type DocumentType,
} from '@/modules/settings';
import type { FileLink, Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import type { CreateDocumentStore } from '../../../../../../../../../store';
import { FeedControlDocumentsIcon } from '../../../../../../../../assets';
import { ActualFeedTabs, FeedControlTab } from '../../FeedControlTab/FeedControlTab';
import { CreateDocumentsDrawer } from './components';

interface Props {
  text: string;
  entityId: number;
  entityTypeId: number;
  createDocumentsDrawerOpened: boolean;
  createDocumentStore: CreateDocumentStore;
  reloadFeed: () => void;
  showEmailModal: (selectedDocuments: FileLink[]) => void;
  showCreateDocumentsDrawer: () => void;
  hideCreateDocumentsDrawer: () => void;
}

const CreateDocumentsTab = observer((props: Props) => {
  const {
    text,
    entityId,
    entityTypeId,
    createDocumentsDrawerOpened,
    createDocumentStore,
    reloadFeed,
    showEmailModal,
    showCreateDocumentsDrawer,
    hideCreateDocumentsDrawer,
  } = props;

  const {
    isCreating,
    entityDocuments,
    isTemplateChecking,
    documentTemplatesInfos,
    loadInfos,
    loadDocuments,
    deleteEntityDocument,
    createEntityDocuments,
    getCreationSyntheticDelay,
    checkEntityDocumentsTemplate,
  } = createDocumentStore;

  useEffect(() => {
    loadInfos(entityTypeId);
    loadDocuments(entityId);
  }, [entityTypeId, entityId, loadDocuments, loadInfos]);

  const getCheckDocumentsTemplateHandler = useCallback(
    async ({
      templateId,
      orderId,
    }: {
      templateId: number;
      orderId?: Nullable<number>;
    }): Promise<CheckEntityDocumentResult> => {
      const dto = new CheckDocumentDto({
        orderId,
        entityId,
        templateId,
      });

      return await checkEntityDocumentsTemplate(dto);
    },
    [checkEntityDocumentsTemplate, entityId]
  );

  const handleCreateDocuments = useCallback(
    async ({
      templateId,
      types,
      orderId,
    }: {
      templateId: number;
      types: DocumentType[];
      orderId?: Nullable<number>;
    }): Promise<void> => {
      const dto = new CreateDocumentDto({
        orderId,
        types,
        entityId,
        templateId,
      });

      await createEntityDocuments({ dto, reloadFeed });
    },
    [entityId, createEntityDocuments, reloadFeed]
  );

  return (
    <>
      <FeedControlTab
        text={text}
        tab={ActualFeedTabs.DOCUMENTS}
        Icon={<FeedControlDocumentsIcon />}
        onClick={showCreateDocumentsDrawer}
      />

      <CreateDocumentsDrawer
        entityId={entityId}
        creating={isCreating}
        entityDocuments={entityDocuments}
        opened={createDocumentsDrawerOpened}
        templateInfos={documentTemplatesInfos}
        isTemplateChecking={isTemplateChecking}
        reloadFeed={reloadFeed}
        showEmailModal={showEmailModal}
        hide={hideCreateDocumentsDrawer}
        deleteDocument={deleteEntityDocument}
        createDocuments={handleCreateDocuments}
        checkTemplate={getCheckDocumentsTemplateHandler}
        getCreationSyntheticDelay={getCreationSyntheticDelay}
      />
    </>
  );
});

CreateDocumentsTab.displayName = 'CreateDocumentsTab';
export { CreateDocumentsTab };
