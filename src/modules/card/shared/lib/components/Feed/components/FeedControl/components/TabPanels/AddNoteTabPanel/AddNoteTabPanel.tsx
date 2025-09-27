import {
  FunctionalTextEditor,
  InputModel,
  throttle,
  useUploadFiles,
  type EditorFileProps,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { convert } from 'html-to-text';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useMemo, useReducer, useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { CreateNoteDto } from '../../../../../../../../../api';
import { TextEditorControls } from '../../../../FeedItem';
import { PlannerBody } from '../../../../PlannerBody/PlannerBody';
import { TextEditorWrapper } from '../TextEditorWrapper/TextEditorWrapper';

interface Props {
  handleAddMessage: (dto: CreateNoteDto) => Promise<boolean>;
}

const AddNoteTabPanel = observer((props: Props) => {
  const { handleAddMessage } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.add_note',
  });

  const [editorKey, rerenderEditor] = useReducer(x => ++x, 0);

  const commentText = useLocalObservable(() => InputModel.create().required());

  const [isLoading, setIsLoading] = useState(false);
  const [focused, { open: handleFocus, close: handleBlur }] = useDisclosure(false);

  const {
    uploadedFiles,
    errorMessages,
    areFilesLoading,
    handleFileEvent,
    resetUploadedFiles,
    deleteUploadedFile,
  } = useUploadFiles();

  const handleClear = useCallback(() => {
    commentText.setValue('');
    resetUploadedFiles();
    rerenderEditor();
  }, [commentText, resetUploadedFiles]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSave = useCallback(
    throttle(async (): Promise<void> => {
      if (!commentText.validate() && !uploadedFiles.length) return;

      try {
        setIsLoading(true);

        const success = await handleAddMessage(
          new CreateNoteDto({
            text: commentText.value,
            fileIds: uploadedFiles.map(f => f.fileId),
          })
        );

        if (success) {
          resetUploadedFiles();
          rerenderEditor();
        }
      } catch (e) {
        throw new Error(`Error while creating note: ${e}`);
      } finally {
        setIsLoading(false);

        handleClear();
        handleBlur();
      }
    }, 1000),
    [commentText.value, uploadedFiles, handleAddMessage, resetUploadedFiles]
  );

  const fileProps = useMemo<EditorFileProps>(
    () => ({
      files: uploadedFiles,
      fileErrors: errorMessages,
      filesLoading: areFilesLoading,
      onFileDelete: deleteUploadedFile,
      onFileChange: handleFileEvent,
    }),
    [uploadedFiles, errorMessages, areFilesLoading, deleteUploadedFile, handleFileEvent]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();

        handleSave();
      }
    },
    [handleSave]
  );

  const isSendButtonVisible =
    convert(commentText.value).length > 0 ||
    uploadedFiles.length > 0 ||
    isLoading ||
    areFilesLoading;

  return (
    <>
      <PlannerBody>
        <TextEditorWrapper $focused={focused}>
          <FunctionalTextEditor
            key={editorKey}
            model={commentText}
            fileProps={fileProps}
            variant="without-border"
            placeholder={t('add_note')}
            TextEditorControls={
              <TextEditorControls
                saving={isLoading}
                visibleSaveButton={isSendButtonVisible}
                handleSave={handleSave}
                handleCancel={isSendButtonVisible ? handleClear : undefined}
              />
            }
            onBlur={handleBlur}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
          />
        </TextEditorWrapper>
      </PlannerBody>
    </>
  );
});

AddNoteTabPanel.displayName = 'AddNoteTabPanel';
export { AddNoteTabPanel };
