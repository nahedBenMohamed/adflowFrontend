import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { VoximplantUser } from '../../../shared';
import { TELEPHONY_QUERY_KEYS } from '../../TelephonyQueryKeys';
import type { CreateVoximplantUserDto } from '../../dtos';
import { voximplantApi } from '../VoximplantApi';

interface CreateVoximplantUserParams {
  userId: number;
  dto: CreateVoximplantUserDto;
}

export const useCreateVoximplantUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, dto }: CreateVoximplantUserParams) =>
      voximplantApi.createVoximplantUser({ userId, dto }),
    onSuccess: async (createdUser: VoximplantUser): Promise<void> => {
      await Promise.all([queryClient.cancelQueries({ queryKey: TELEPHONY_QUERY_KEYS.users() })]);

      queryClient.setQueryData<VoximplantUser[]>(TELEPHONY_QUERY_KEYS.users(), prev =>
        prev
          ? prev.find(u => u.userId === createdUser.userId)
            ? prev
            : [...prev, createdUser]
          : [createdUser]
      );
    },
  });
};
