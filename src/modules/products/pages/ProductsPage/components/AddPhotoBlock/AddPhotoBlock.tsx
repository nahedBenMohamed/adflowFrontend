import { observer } from 'mobx-react-lite';
import { type ChangeEvent, useRef, useState } from 'react';
import styled from 'styled-components';

import { FileSizeWarningModal, PlusIconButton, type UploadFilesControl } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { PhotoBlockItem } from '../PhotoBlockItem/PhotoBlockItem';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 8px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PlusIconWrapper = styled.div`
  width: 24px;
  height: 28px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

// in bytes (5mb)
const PRODUCT_PHOTO_MAX_SIZE = 5 * 1024 * 1024;

interface Props {
  uploadFilesControl: UploadFilesControl;
}

const AddPhotoBlock = observer((props: Props) => {
  const { uploadFilesControl } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const [fileSizeWarningOpened, { open: openFileSizeWarning, close: closeFileSizeWarning }] =
    useDisclosure(false);

  const { uploadedFiles, deleteUploadedFile, handleFileEvent } = uploadFilesControl;

  const handleClick = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (e.target.files) {
      for (let file of e.target.files) {
        if (file.size > PRODUCT_PHOTO_MAX_SIZE) {
          openFileSizeWarning();

          return;
        }
      }
    }

    try {
      setUploading(true);

      await handleFileEvent(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Root>
        {uploadedFiles.map(f => (
          <PhotoBlockItem key={f.fileId} file={f} onDelete={() => deleteUploadedFile(f.fileId)} />
        ))}

        <PlusIconWrapper>
          <PlusIconButton isGreen loading={uploading} disabled={uploading} onClick={handleClick} />

          <HiddenInput
            ref={inputRef}
            multiple
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleChange}
          />
        </PlusIconWrapper>
      </Root>

      {fileSizeWarningOpened && (
        <FileSizeWarningModal
          maxSizeMb={5}
          isOpened={fileSizeWarningOpened}
          onClose={closeFileSizeWarning}
        />
      )}
    </>
  );
});

AddPhotoBlock.displayName = 'AddPhotoBlock';
export { AddPhotoBlock };
