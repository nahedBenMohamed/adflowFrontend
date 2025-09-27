import type { ReportingOption } from './ReportingOption';
import type { SubdepartmentWithUsersOption } from './SubdepartmentWithUsersOption';

export interface DepartmentWithUsersOption {
  department: {
    id: number;
    name: string;
    options: ReportingOption[];
    amount: number;
    quantity: number;
  };
  subdepartments: SubdepartmentWithUsersOption[];
}
