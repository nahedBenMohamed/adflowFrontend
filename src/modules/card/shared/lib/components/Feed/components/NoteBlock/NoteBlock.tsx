import { userStore } from '@/app';
import {
  DeleteButton,
  FileUtil,
  InputModel,
  PencilButton,
  type FileLink,
  type FunctionalOptionWithComponent,
  type Note,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { NoteBlockTemplate } from './components';

interface Props {
  note: Note;
  updateNote: (note: Note) => void;
  onDelete: () => void;
}

const NoteBlock = observer((props: Props) => {
  const { note, updateNote, onDelete } = props;
  const { fileLinks, createdAt, createdBy, text } = note;

  const { t } = useTranslation();

  const textModel = useLocalObservable(() => InputModel.create(text).required());
  const [isEditMode, { toggle: toggleEditMode, close: hideEditMode }] = useDisclosure(false);

  const onSave = () => {
    if (!textModel.validate()) return;

    note.text = textModel.value;
    updateNote(note);
    hideEditMode();
  };

  const onDeleteFileLink = (file: FileLink) => {
    note.fileLinks = note.fileLinks.filter(f => f.fileInfo.fileId !== file.fileInfo.fileId);

    FileUtil.deleteFileLink(file.id);

    if (note.fileLinks.length === 0 && note.text.length === 0) onDelete();
  };

  const creator = userStore.getById(createdBy);

  const headerControlsDropdownOptions: FunctionalOptionWithComponent[] = [
    {
      label: <PencilButton text={t('buttons.edit')} />,
      value: toggleEditMode,
    },
    {
      danger: true,
      label: <DeleteButton text={t('buttons.delete')} fontWeight={400} />,
      value: () => onDelete(),
    },
  ];

  return (
    <NoteBlockTemplate
      text={text}
      creator={creator}
      createdAt={createdAt}
      fileLinks={fileLinks}
      headerControlsDropdownOptions={headerControlsDropdownOptions}
      editTextProps={{
        isEditMode,
        textModel,
        onSave,
        hideEditMode,
      }}
      handleDeleteFileLink={onDeleteFileLink}
    />
  );
});

NoteBlock.displayName = 'NoteBlock';
export { NoteBlock };
