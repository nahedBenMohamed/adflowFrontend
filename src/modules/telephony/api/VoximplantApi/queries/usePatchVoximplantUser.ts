import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantUser } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import type { UpdateVoximplantUserDto } from '../../dtos';
import { voximplantApi } from '../VoximplantApi';

export const usePatchVoximplantUser = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateVoximplantUserDto) =>
      voximplantApi.patchVoximplantUser({ userId, dto }),
    onSuccess: async (updatedUser: VoximplantUser): Promise<void> => {
      await Promise.all([queryClient.cancelQueries({ queryKey: TELEPHONY_QUERY_KEYS.users() })]);

      queryClient.setQueryData<VoximplantUser[]>(TELEPHONY_QUERY_KEYS.users(), prev =>
        prev ? prev.map(u => (u.userId === updatedUser.userId ? updatedUser : u)) : []
      );
    },
  });
};
