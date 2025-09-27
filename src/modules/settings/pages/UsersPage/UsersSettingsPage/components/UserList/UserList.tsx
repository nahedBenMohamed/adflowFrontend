import type { User } from '@/shared';
import { UserItem } from '../UserItem/UserItem';

interface Props {
  users: User[];
  onDelete: (userId: number) => void;
}

const UserList = (props: Props) => {
  const { users, onDelete } = props;

  return (
    <ul>
      {users.map(u => (
        <UserItem key={u.id} user={u} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export { UserList };
