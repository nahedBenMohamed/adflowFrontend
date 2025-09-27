import { DialogModalSecondary, envUtil, type Nullable } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { entitiesImportStore } from '../../../../../../store';
import { DownloadExampleButton } from '../Buttons/DownloadExampleButton';
import { UploadImportFileButton } from '../Buttons/UploadImportFileButton';

const Root = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  padding: 16px 24px;
`;

const Content = styled.div`
  display: flex;
  gap: 24px;
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  font-size: 14px;
  line-height: 20px;
`;

const StyledImage = styled.img`
  width: 262px;
  height: 216px;
`;

const Annotation = styled.p`
  font-weight: 400;
  color: var(--button-text-graphite-primary-text);
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;

  color: var(--button-text-graphite-priory-text);
`;

const ListTitle = styled.p`
  font-weight: 500;
`;

const List = styled.ul`
  list-style: disc;

  padding-left: 16px;
`;

const ListItem = styled.li`
  font-weight: 400;
`;

const Controls = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: calc(40% - 12px) calc(60% - 12px);
  gap: 24px;
`;

interface ListData {
  title: string;
  listItems: string[];
}

interface Props {
  entityTypeId: number;
  entityTypeName: string;
  opened: boolean;
  onClose: () => void;
  showInfoModal: () => void;
}

const ImportEntitiesModal = observer((props: Props) => {
  const { entityTypeId, entityTypeName, opened, onClose, showInfoModal } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.settings_button.import_entities_modal',
  });

  const [fileToUpload, setFileToUpload] = useState<Nullable<File>>(null);

  const settingUpAFileToImport: ListData = {
    title: t('setting_up_file_to_import.title'),
    listItems: [
      t('setting_up_file_to_import.step1'),
      t('setting_up_file_to_import.step2', { company: envUtil.appName }),
      t('setting_up_file_to_import.step3'),
    ],
  };

  const importFile: ListData = {
    title: t('import_file.title'),
    listItems: [t('import_file.step1'), t('import_file.step2'), t('import_file.step3')],
  };

  const { isImporting, importEntities } = entitiesImportStore;

  const handleApproveImport = async (): Promise<void> => {
    if (fileToUpload) importEntities({ entityTypeId, file: fileToUpload });

    onClose();
    showInfoModal();
  };

  return (
    <DialogModalSecondary
      width="100%"
      maxWidth="824px"
      maxHeight="480px"
      Header={t('title')}
      loading={isImporting}
      approveTitle={t('perform_import')}
      approveDisabled={!fileToUpload || isImporting}
      isOpened={opened}
      onClose={onClose}
      onApprove={handleApproveImport}
    >
      <Root>
        <Content>
          <StyledImage src="/images/components/ImportEntitiesModal/import_entities.svg" />

          <ArticleWrapper>
            <Annotation>{t('annotation', { company: envUtil.appName })}</Annotation>

            <ListWrapper>
              <ListTitle>{settingUpAFileToImport.title}</ListTitle>
              <List>
                {settingUpAFileToImport.listItems.map((i, idx) => (
                  <ListItem key={idx}>{i}</ListItem>
                ))}
              </List>
            </ListWrapper>

            <ListWrapper>
              <ListTitle>{importFile.title}</ListTitle>
              <List>
                {importFile.listItems.map((i, idx) => (
                  <ListItem key={idx}>{i}</ListItem>
                ))}
              </List>
            </ListWrapper>
          </ArticleWrapper>
        </Content>

        <Controls>
          <DownloadExampleButton entityTypeId={entityTypeId} entityTypeName={entityTypeName} />
          <UploadImportFileButton fileToUpload={fileToUpload} setFileToUpload={setFileToUpload} />
        </Controls>
      </Root>
    </DialogModalSecondary>
  );
});

ImportEntitiesModal.displayName = 'ImportEntitiesModal';
export { ImportEntitiesModal };
