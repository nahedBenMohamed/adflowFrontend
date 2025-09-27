import { useQueries } from '@tanstack/react-query';
import { APP_QUERY_KEYS } from '../../AppQueryKeys';
import { fileApi } from '../FileApi';

export const useGetFileInfos = (fileIds: string[]) =>
  useQueries({
    queries: fileIds.map(fileId => ({
      queryKey: APP_QUERY_KEYS.fileInfoById(fileId),
      queryFn: () => fileApi.getFileInfo(fileId),
    })),
    combine: res => ({
      data: res.map(r => r.data),
      isLoading: res.some(result => result.isPending),
    }),
  });
