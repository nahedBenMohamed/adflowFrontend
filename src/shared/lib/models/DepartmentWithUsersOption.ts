import type { Avatar, Option } from '@/shared';
import type { SubdepartmentWithUsersOption } from './SubdepartmentWithUsersOption';

export interface DepartmentWithUsersOption {
  department: {
    id: number;
    name: string;
    options: Option<number, { avatar: Avatar }>[];
  };
  subdepartments: SubdepartmentWithUsersOption[];
}
