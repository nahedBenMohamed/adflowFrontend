import { MultiselectModel, ParticipantsSelect, debounce, type Nullable, type User } from '@/shared';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UpdateVoximplantNumberDto, useUpdateVoximplantPhoneNumber } from '../../../../../../api';

interface Props {
  numberId: Nullable<number>;
  availableUsers: User[];
  userIds?: number[];
}

const VoximplantNumbersBlockUsersCell = observer((props: Props) => {
  const { numberId, availableUsers, userIds } = props;

  const { t } = useTranslation('module.telephony', {
    keyPrefix: 'telephony.pages.calls_settings_account_page',
  });

  const model = useLocalObservable(() => MultiselectModel.create(userIds ?? []));

  const { mutate: updateVoximplantPhoneNumber } = useUpdateVoximplantPhoneNumber();

  useEffect(() => {
    if (!numberId && model.values.length > 0) model.setValue([]);
  }, [model, numberId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDebouncedUpdateVoximplantPhoneNumber = useCallback(
    debounce((userIds: number[]) => {
      if (!numberId)
        throw new Error(
          'Failed to update Voximplant phone number, numberId does not exist, phone is not connected'
        );

      updateVoximplantPhoneNumber({ numberId, dto: new UpdateVoximplantNumberDto({ userIds }) });
    }, 500),
    [numberId]
  );

  if (!numberId) return null;

  return (
    <ParticipantsSelect
      withinPortal
      model={model}
      disabled={!numberId}
      specificUsers={availableUsers}
      placeholder={t('placeholders.all_users')}
      showPlaceholder={!model.values || model.values.length === 0}
      handleChange={handleDebouncedUpdateVoximplantPhoneNumber}
    />
  );
});

VoximplantNumbersBlockUsersCell.displayName = 'VoximplantNumbersBlockUsersCell';
export { VoximplantNumbersBlockUsersCell };
