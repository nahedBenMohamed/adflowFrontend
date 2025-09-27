import { fileApi, type FileUploadResult } from '@/app';

export class FileUtil {
  static async deleteFile(id: string): Promise<void> {
    try {
      await fileApi.deleteFile(id);
    } catch (e) {
      throw new Error(`Error while deleting file with id ${id}: ${e}`);
    }
  }

  static async deleteFileLink(id: number): Promise<void> {
    try {
      await fileApi.deleteFileLink(id);
    } catch (e) {
      throw new Error(`Error while deleting file link with id ${id}: ${e}`);
    }
  }

  static async deleteFileLinks(ids: number[]): Promise<void> {
    try {
      await fileApi.deleteFileLinks(ids);
    } catch (e) {
      throw new Error(`Error while deleting file links with ids ${ids.join(',')}: ${e}`);
    }
  }

  static async downloadFile({ url, fileName }: { url: string; fileName: string }): Promise<void> {
    try {
      await fileApi.downloadFile({ url, fileName });
    } catch (e) {
      throw new Error(`Error while downloading file from ${url}: ${e}`);
    }
  }

  static async uploadFiles(formData: FormData): Promise<FileUploadResult[]> {
    try {
      return await fileApi.uploadFiles(formData);
    } catch (e) {
      throw new Error(`Error while uploading files: ${e}`);
    }
  }
}
