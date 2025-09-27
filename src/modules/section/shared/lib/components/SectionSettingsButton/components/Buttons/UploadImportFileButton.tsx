import { FileSizeWarningModal, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useRef, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UploadIcon } from '../../../../../assets';
import { ImportFileBlock } from '../ImportFileBlock/ImportFileBlock';
import { ButtonIconWrapper } from './IconWrapper';

const Root = styled.button`
  position: relative;

  height: 60px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 14px 16px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  svg path {
    fill: var(--button-text-graphite-secondary-text);

    transition: var(--transition-200);
  }

  &:hover {
    cursor: pointer;

    border-color: var(--button-text-graphite-primary-text);

    svg path {
      fill: var(--button-text-graphite-primary-text);
    }
  }

  &:active {
    border-color: var(--button-text-graphite-secondary-text);

    svg path {
      fill: var(--button-text-graphite-secondary-text);
    }
  }

  &:disabled {
    pointer-events: none;

    color: var(--button-text-graphite-secondary-text);

    opacity: 0.5;
    border-color: var(--button-text-graphite-secondary-text);

    svg path {
      fill: var(--button-text-graphite-secondary-text);
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

// in bytes (10mb)
const ENTITIES_IMPORT_MAX_FILE_SIZE = 10 * 1024 * 1024;

interface Props {
  fileToUpload: Nullable<File>;
  setFileToUpload: (file: Nullable<File>) => void;
}

const UploadImportFileButton = (props: Props) => {
  const { fileToUpload, setFileToUpload } = props;

  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.common.settings_button',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [fileSizeWarningOpened, { open: openFileSizeWarning, close: closeFileSizeWarning }] =
    useDisclosure(false);

  const handleClickInput = () => {
    inputRef.current?.click();
  };

  const handleSelectFileToImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files as FileList;

    const firstFile = files[0];

    if (firstFile) {
      if (firstFile.size > ENTITIES_IMPORT_MAX_FILE_SIZE) {
        openFileSizeWarning();

        return;
      }

      setFileToUpload(firstFile);

      target.value = '';
    }
  };

  return fileToUpload ? (
    <ImportFileBlock file={fileToUpload} onDelete={() => setFileToUpload(null)} />
  ) : (
    <>
      <Root onClick={handleClickInput}>
        <ButtonIconWrapper>
          <UploadIcon />
        </ButtonIconWrapper>

        {t('upload_file')}

        <HiddenInput
          ref={inputRef}
          type="file"
          accept=".xlsx"
          onChange={handleSelectFileToImport}
        />
      </Root>

      {fileSizeWarningOpened && (
        <FileSizeWarningModal
          maxSizeMb={10}
          isOpened={fileSizeWarningOpened}
          onClose={closeFileSizeWarning}
        />
      )}
    </>
  );
};

export { UploadImportFileButton };
