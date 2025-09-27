import { CreateButton, FileSizeWarningModal } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import type { ChangeEvent } from 'react';
import styled, { css } from 'styled-components';
import { ClipLargeIcon, ClipMediumIcon, ClipSmallIcon } from '../../../assets';
import type { FileInfo, FileModel } from '../../models';
import type { Nullable } from '../../types';
import { MiniLoader } from '../Loaders/MiniLoader/MiniLoader';
import { PickerButton } from '../PickerButton/PickerButton';
import { CompactFileList, InputFileList } from './components';

interface RootProps {
  $margin: string;
  $row?: boolean;
}

const Root = styled.div<RootProps>`
  display: flex;
  flex: 1;
  flex-direction: column;

  margin: ${p => p.$margin};

  ${p =>
    p.$row &&
    css`
      flex-direction: row;
      align-items: center;
      gap: 12px;
    `}
`;

interface InputWrapperProps {
  $active: boolean;
  $hasFiles?: boolean;
  $disabled?: boolean;
  $hasDelimiter?: boolean;
  $asSmallIcon?: boolean;
  $asLargeIcon?: boolean;
}

const InputWrapper = styled.label<InputWrapperProps>`
  position: relative;

  ${p =>
    p.$hasFiles &&
    css`
      margin-bottom: 8px;
      padding-bottom: 8px;
    `}

  ${p => p.$hasFiles && (p.$asSmallIcon || p.$asLargeIcon) && `padding-bottom: 0`};

  ${p =>
    p.$asSmallIcon &&
    css`
      width: 16px;
      height: 16px;
    `}

  ${p =>
    p.$asLargeIcon &&
    css`
      width: 24px;
      height: 24px;
    `}

    ${p =>
    (p.$asSmallIcon || p.$asLargeIcon) &&
    css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg path {
        ${p.$active && `fill: var(--button-text-green-hover)`};

        transition: var(--transition-200);
      }

      &:hover {
        svg path {
          fill: var(--button-text-green-active);
        }
      }
    `}

  ${p => p.$hasFiles && p.$hasDelimiter && `border-bottom: 1px solid var(--graphite-graphite-80)`};

  input {
    position: absolute;
    top: 0;
    left: 0;

    width: 0;
    height: 0;

    z-index: -1;
    opacity: 0;
  }

  &:hover {
    cursor: pointer;
  }

  ${p => p.$disabled && `pointer-events: none`};
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: var(--button-text-red-default);
`;

// in bytes (1.5Gb)
const MAX_FILE_SIZE = 1536 * 1024 * 1024;

type ViewType = 'icon-small' | 'icon-large' | 'input' | 'add-button';

export interface FileInputProps {
  as?: ViewType;
  title?: string;
  margin?: string;
  active?: boolean;
  loading?: boolean;
  compact?: boolean;
  showFiles?: boolean;
  collapsing?: boolean;
  hasDelimiter?: boolean;
  fileSizeLimit?: number;
  hasActiveView?: boolean;
  showPickerValue?: boolean;
  errors?: Nullable<string[]>;
  files?: FileInfo[] | FileModel[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (fileId: string) => void;
}

const FileInput = (props: FileInputProps) => {
  const {
    as = 'input',
    title = 'Attach files',
    margin = '0px',
    active = false,
    loading = false,
    compact = false,
    showFiles = true,
    collapsing = false,
    hasDelimiter = true,
    hasActiveView = true,
    showPickerValue = true,
    fileSizeLimit = MAX_FILE_SIZE,
    errors = null,
    files = [],
    onChange,
    onDelete,
  } = props;

  const [fileSizeWarningOpened, { open: openFileSizeWarning, close: closeFileSizeWarning }] =
    useDisclosure(false);

  const hasFilesOrActive = files.length > 0 || active;

  // convert bytes to mb
  const fileSizeLimitMb = fileSizeLimit / (1024 * 1024);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      for (let file of e.target.files) {
        if (file.size > fileSizeLimit) {
          openFileSizeWarning();

          return;
        }
      }
    }

    onChange(e);
    e.target.value = '';
  };

  return (
    <>
      <Root $margin={margin} $row={compact}>
        <InputWrapper
          $disabled={loading}
          $active={hasFilesOrActive}
          $hasDelimiter={hasDelimiter && !compact}
          $asSmallIcon={as === 'icon-small'}
          $asLargeIcon={as === 'icon-large'}
          $hasFiles={files.length > 0 && showFiles && !compact}
        >
          {as === 'input' && (
            <PickerButton
              active={hasActiveView ? hasFilesOrActive : false}
              value={title}
              showValue={showPickerValue}
              Icon={
                loading ? (
                  <MiniLoader color="var(--button-text-graphite-secondary-text)" />
                ) : (
                  <ClipMediumIcon />
                )
              }
            />
          )}

          {as === 'icon-small' &&
            (loading ? (
              <MiniLoader color="var(--button-text-graphite-secondary-text)" size="small" />
            ) : (
              <ClipSmallIcon />
            ))}

          {as === 'icon-large' &&
            (loading ? (
              <MiniLoader color="var(--button-text-graphite-secondary-text)" />
            ) : (
              <ClipLargeIcon />
            ))}

          {as === 'add-button' && (
            <CreateButton
              isButtonFrame
              width="fit-content"
              isLoading={loading}
              customTitle={title}
            />
          )}

          {errors && errors.map((error, idx) => <ErrorMessage key={idx}>{error}</ErrorMessage>)}

          <input type="file" multiple onChange={handleChange} />
        </InputWrapper>

        {files.length > 0 && showFiles && (
          <>
            {compact ? (
              <CompactFileList files={files} onDelete={onDelete} />
            ) : (
              <InputFileList collapsing={collapsing} files={files} onDelete={onDelete} />
            )}
          </>
        )}
      </Root>

      {fileSizeWarningOpened && (
        <FileSizeWarningModal
          maxSizeMb={fileSizeLimitMb}
          isOpened={fileSizeWarningOpened}
          onClose={closeFileSizeWarning}
        />
      )}
    </>
  );
};

export { FileInput };
