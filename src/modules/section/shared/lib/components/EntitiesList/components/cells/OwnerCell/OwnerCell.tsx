import { userStore } from '@/app';
import { SelectModel, UserPicker, type User } from '@/shared';
import type { CellContext } from '@tanstack/react-table';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect } from 'react';
import type { SectionTableRow } from '../../../../../models';

interface Props {
  cellContext: CellContext<SectionTableRow, number>;
  changeResponsible: ({ id, responsibleUserId }: { id: number; responsibleUserId: number }) => void;
}

const OwnerCell = observer((props: Props) => {
  const { cellContext, changeResponsible } = props;

  const ownerId = cellContext.getValue();
  const { entityId, readonly } = cellContext.row.original;

  const handleChangeResponsible = useCallback(
    ({ responsibleUserId, entityId }: { responsibleUserId: number; entityId: number }) =>
      changeResponsible({ id: entityId, responsibleUserId }),
    [changeResponsible]
  );

  const onChange = useCallback(
    (ownerId: number) => handleChangeResponsible({ responsibleUserId: ownerId, entityId }),
    [entityId, handleChangeResponsible]
  );

  const model = useLocalObservable(() => SelectModel.create(ownerId));

  const handleChange = useCallback(
    (user: User) => {
      model.value = user.id;

      onChange(user.id);
    },
    [model, onChange]
  );

  useEffect(() => {
    model.setValue(ownerId);
  }, [ownerId, model]);

  return (
    <UserPicker
      withinPortal
      noActiveShadow
      disabled={readonly}
      selectedId={model.value}
      users={userStore.activeUsers}
      onSelect={handleChange}
    />
  );
});

OwnerCell.displayName = 'OwnerCell';
export { OwnerCell };
