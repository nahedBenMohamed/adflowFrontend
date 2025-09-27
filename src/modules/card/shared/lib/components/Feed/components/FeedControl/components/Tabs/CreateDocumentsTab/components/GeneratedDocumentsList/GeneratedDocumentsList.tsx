import {
  DeleteButton,
  DownloadButton,
  FileUtil,
  MyCheckbox,
  MyCheckboxWithModel,
  type CheckboxModel,
  type FileLink,
} from '@/shared';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GeneratedDocumentItem } from '../GeneratedDocumentItem/GeneratedDocumentItem';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding-right: 8px;

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TitleControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface Props {
  model: CheckboxModel;
  documents: FileLink[];
  reloadFeed: () => void;
  onDelete: (id: number) => Promise<void>;
}

const GeneratedDocumentsList = observer((props: Props) => {
  const { model, documents, reloadFeed, onDelete } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.create_documents',
  });

  const [downloadingSelected, setDownloadingSelected] = useState(false);

  const handleCheckAll = useCallback(() => {
    if (model.values.length === documents.length) {
      model.setValues([]);
    } else {
      model.setValues(documents.map(d => d.id));
    }
  }, [documents, model]);

  const handleDeleteSelected = useCallback(async (): Promise<void> => {
    const idsToDelete = toJS(model.values);

    if (!idsToDelete.length) return;

    await Promise.all(model.values.map(async (id): Promise<void> => await onDelete(id)));

    model.values = model.values.filter(id => !idsToDelete.includes(id));

    reloadFeed();
  }, [model, onDelete, reloadFeed]);

  const getDeleteDocumentHandler = useCallback(
    (id: number) => async (): Promise<void> => {
      await onDelete(id);

      reloadFeed();
    },
    [onDelete, reloadFeed]
  );

  const getDownloadDocumentHandler = useCallback(
    ({ downloadUrl, fileName }: { downloadUrl: string; fileName: string }) =>
      async (): Promise<void> =>
        await FileUtil.downloadFile({ url: downloadUrl, fileName }),
    []
  );

  const handleDownloadSelected = useCallback(async (): Promise<void> => {
    if (!model.values.length) return;

    try {
      setDownloadingSelected(true);

      await Promise.all(
        model.values.map<Promise<void>>(id => {
          const document = documents.find(d => d.id === id);

          if (document)
            return getDownloadDocumentHandler({
              fileName: document.fileInfo.fileName,
              downloadUrl: document.fileInfo.downloadUrl,
            })();

          return Promise.resolve();
        })
      );
    } finally {
      setDownloadingSelected(false);
    }
  }, [documents, model.values, getDownloadDocumentHandler]);

  const nothingSelected = !model.values.length;

  const isHeaderCheckboxChecked = model.values.length === documents.length;
  const isHeaderCheckboxIndeterminate = model.values.length > 0 && !isHeaderCheckboxChecked;

  return (
    <Root>
      {documents.length > 0 && (
        <TitleWrapper>
          <CheckboxWrapper as="label">
            <MyCheckbox
              checked={isHeaderCheckboxChecked}
              indeterminate={isHeaderCheckboxIndeterminate}
              onClick={handleCheckAll}
            />

            {isHeaderCheckboxChecked ? t('clear_selection') : t('select_all')}
          </CheckboxWrapper>

          <TitleControls>
            <DownloadButton
              disabled={nothingSelected}
              loading={downloadingSelected}
              onClick={handleDownloadSelected}
            />
            <DeleteButton disabled={nothingSelected} onClick={handleDeleteSelected} />
          </TitleControls>
        </TitleWrapper>
      )}

      <List>
        {documents.map(d => (
          <CheckboxWrapper key={d.id}>
            <MyCheckboxWithModel model={model} value={d.id} />

            <GeneratedDocumentItem
              document={d}
              onDelete={getDeleteDocumentHandler(d.id)}
              onDownload={getDownloadDocumentHandler({
                downloadUrl: d.fileInfo.downloadUrl,
                fileName: d.fileInfo.fileName,
              })}
            />
          </CheckboxWrapper>
        ))}
      </List>
    </Root>
  );
});

GeneratedDocumentsList.displayName = 'GeneratedDocumentsList';
export { GeneratedDocumentsList };
