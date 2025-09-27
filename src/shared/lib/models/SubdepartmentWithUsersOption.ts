import type { Avatar, Option } from '@/shared';

export interface SubdepartmentWithUsersOption {
  id: number;
  name: string;
  options: Option<number, { avatar: Avatar }>[];
}
