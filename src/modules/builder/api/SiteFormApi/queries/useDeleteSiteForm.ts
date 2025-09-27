import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BUILDER_QUERY_KEYS } from '../../BuilderQueryKeys';
import { siteFormApi } from '../SiteFormApi';

export const useDeleteSiteForm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (siteFormId: number) => siteFormApi.deleteSiteForm(siteFormId),
    onSuccess: async (): Promise<void> => {
      await queryClient.cancelQueries({ queryKey: BUILDER_QUERY_KEYS.siteForms() });

      queryClient.invalidateQueries({ queryKey: BUILDER_QUERY_KEYS.siteForms() });
    },
  });
};
