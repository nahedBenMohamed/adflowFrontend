import {
  AvatarCircle,
  FunctionalTextEditor,
  InputModel,
  useUploadFiles,
  type User,
} from '@/shared';
import { convert } from 'html-to-text';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CreateTaskCommentDto } from '../../../../../../../api';

const Root = styled.div`
  display: flex;
  gap: 8px;
`;

const Body = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

interface Props {
  currentUser: User;
  onAdd: (dto: CreateTaskCommentDto) => Promise<void>;
}

const AddComment = observer((props: Props) => {
  const { currentUser, onAdd } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'update_task_modal',
  });

  const text = useLocalObservable(() => InputModel.create());
  const [adding, setAdding] = useState(false);

  const {
    areFilesLoading,
    uploadedFiles,
    errorMessages,
    deleteUploadedFile,
    resetUploadedFiles,
    handleFileEvent,
  } = useUploadFiles();

  const isSendButtonVisible = convert(text.value).length > 0 || uploadedFiles.length > 0;

  const handleAdd = async (): Promise<void> => {
    try {
      setAdding(true);

      const dto = new CreateTaskCommentDto({
        text: text.trimmedValue,
        fileIds: uploadedFiles.map<string>(f => f.fileId),
      });

      await onAdd(dto);

      resetUploadedFiles();
    } catch (e) {
      console.error(`Error while adding comment: ${e}`);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Root>
      <AvatarCircle avatar={currentUser.getAvatar()} />

      <Body>
        <FunctionalTextEditor
          placeholder={t('new_comment')}
          model={text}
          rightButtonProps={{
            iconType: 'send',
            visible: isSendButtonVisible,
            clearEditorOnClick: true,
            loading: adding,
            disabled: areFilesLoading,
            onClick: handleAdd,
          }}
          fileProps={{
            filesLoading: areFilesLoading,
            fileErrors: errorMessages,
            files: uploadedFiles,
            onFileChange: handleFileEvent,
            onFileDelete: deleteUploadedFile,
          }}
        />
      </Body>
    </Root>
  );
});

AddComment.displayName = 'AddComment';
export { AddComment };
