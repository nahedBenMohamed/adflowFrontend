import type { ReportingOption } from './ReportingOption';

export interface SubdepartmentWithUsersOption {
  id: number;
  name: string;
  options: ReportingOption[];
  amount: number;
  quantity: number;
}
