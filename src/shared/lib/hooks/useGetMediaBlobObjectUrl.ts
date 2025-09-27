import { fileApi } from '@/app';
import { useQuery } from '@tanstack/react-query';

const mediaBlobQueryKey = (url: string) => ['media-blob-object-url', url];

export const useGetMediaBlobObjectUrl = ({
  downloadUrl,
  enabled,
}: {
  downloadUrl: string;
  enabled: boolean;
}) =>
  useQuery({
    enabled,
    gcTime: 20 * 60 * 1000,
    staleTime: 15 * 60 * 1000,
    queryKey: mediaBlobQueryKey(downloadUrl),
    queryFn: () => fileApi.getMediaBlobObjectUrl(downloadUrl),
  });
