import { useCallback, useMemo, useState, type ChangeEvent } from 'react';
import { type FileUploadResult } from '../../../app/api/FileApi/FileApi';
import { authStore } from '../../../modules/auth/store/AuthStore';
import { FileInfo } from '../models/FileInfo/FileInfo';
import { UtcDate } from '../models/UtcDate';
import { type Nullable, type Optional } from '../types';
import { UuidUtil } from '../utils';
import { FileUtil } from '../utils/FileUtil';

// in bytes (1.5Gb)
const MAX_FILE_SIZE = 1536 * 1024 * 1024;

interface FileObject {
  key: string;
  file: File;
}

export interface UploadFilesControl {
  uploadedFiles: FileInfo[];
  areFilesLoading: boolean;
  errorMessages: Nullable<string[]>;
  handleFileEvent: (
    e: ChangeEvent<HTMLInputElement>,
    sendToSystemFileStorage?: boolean
  ) => Promise<Optional<File[]>>;
  resetUploadedFiles: () => void;
  deleteUploadedFile: (fileId: string) => void;
}

export const useUploadFiles = (): UploadFilesControl => {
  const currentUser = authStore.user;

  const filesToUpload: FileObject[] = useMemo(() => [], []);

  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [areFilesLoading, setAreFilesLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<Nullable<string[]>>(null);

  const upload = useCallback(
    async (files: FileObject[], sendToSystemFileStorage: boolean = true) => {
      const mapResult = (result: FileUploadResult[], toUpload: FileObject[]) => {
        for (const res of result) {
          const mappedFile = toUpload.find(f => {
            return f.key === res.key;
          });

          if (mappedFile && currentUser) {
            const uploadedFile = new FileInfo({
              fileId: res.id,
              fileName: mappedFile.file.name,
              fileSize: mappedFile.file.size,
              fileType: mappedFile.file.type,
              downloadUrl: res.downloadUrl,
              previewUrl: res.previewUrl,
              createdAt: UtcDate.now(),
              createdBy: currentUser.id,
            });

            setUploadedFiles(prev => [...prev, uploadedFile]);
          }
        }
      };

      const formData = new FormData();

      files.forEach(fileObject => {
        formData.append(fileObject.key, fileObject.file, encodeURIComponent(fileObject.file.name));
      });

      if (sendToSystemFileStorage) {
        const result = await FileUtil.uploadFiles(formData);

        mapResult(result, filesToUpload);
      }
    },
    [filesToUpload, currentUser]
  );

  const handleFileEvent = useCallback(
    async (e: ChangeEvent<HTMLInputElement>, sendToSystemFileStorage: boolean = true) => {
      setErrorMessages(null);

      try {
        setAreFilesLoading(true);

        // we use this method to convert array-like objects to an array (e.target.files is typeof FileList)
        const chosenFiles: File[] = Array.prototype.slice.call(e.target.files);
        const errorFiles = chosenFiles.filter(file => file.size > MAX_FILE_SIZE);
        const validFiles = chosenFiles.filter(file => file.size <= MAX_FILE_SIZE);

        if (errorFiles.length > 0) {
          setErrorMessages(
            errorFiles.map(file => `File "${file.name}" size exceeds the maximum allowed`)
          );
        }

        if (validFiles.length <= 0) {
          return;
        }

        filesToUpload.splice(
          0,
          filesToUpload.length,
          ...validFiles.map(f => ({ key: UuidUtil.generate(), file: f }))
        );

        if (sendToSystemFileStorage) {
          await upload(filesToUpload);

          return;
        }

        return filesToUpload.map(f => f.file);
      } catch (e) {
        console.error('Error while uploading files', e);
      } finally {
        setAreFilesLoading(false);
      }
    },
    [filesToUpload, upload]
  );

  const deleteUploadedFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.fileId !== fileId));

    FileUtil.deleteFile(fileId);
  }, []);

  const resetUploadedFiles = useCallback(() => {
    setUploadedFiles([]);
    setErrorMessages(null);
  }, []);

  return {
    uploadedFiles,
    areFilesLoading,
    errorMessages,
    handleFileEvent,
    resetUploadedFiles,
    deleteUploadedFile,
  };
};
