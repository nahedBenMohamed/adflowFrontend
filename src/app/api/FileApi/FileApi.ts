import { FileInfo, type Nullable } from '@/shared';
import { UrlTemplateUtil } from '@/shared/lib/utils/UrlTemplateUtil';
import fileDownload from 'js-file-download';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';

export interface FileUploadResult {
  key: string;
  id: string;
  downloadUrl: string;
  previewUrl: Nullable<string>;
}

class FileApi {
  getFileInfo = async (fileId: string): Promise<FileInfo> => {
    const response = await baseApi.get(UrlTemplateUtil.toPath(ApiRoutes.GET_FILE_INFO, { fileId }));

    return FileInfo.fromResultDto(response.data);
  };

  uploadFiles = async (formData: FormData): Promise<FileUploadResult[]> => {
    const response = await baseApi.post(ApiRoutes.UPLOAD_FILES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  };

  downloadFile = async ({ url, fileName }: { url: string; fileName: string }): Promise<void> => {
    const response = await baseApi.get(url, {
      responseType: 'blob',
    });

    fileDownload(response.data, fileName);
  };

  getMediaBlobObjectUrl = async (url: string): Promise<Nullable<string>> => {
    const result = await baseApi.get(url, {
      responseType: 'blob',
    });

    if (result) return URL.createObjectURL(result.data);

    return null;
  };

  deleteFile = async (fileId: string): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_FILE, { id: fileId }));
  };

  deleteFileLink = async (id: number): Promise<void> => {
    await baseApi.delete(UrlTemplateUtil.toPath(ApiRoutes.DELETE_FILE_LINK, { id }));
  };

  deleteFileLinks = async (ids: number[]): Promise<void> => {
    await baseApi.delete(ApiRoutes.DELETE_FILE_LINKS, {
      params: {
        ids: ids.join(','),
      },
    });
  };
}

export const fileApi = new FileApi();
