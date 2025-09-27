import { type Nullable } from '../../types';

export interface JwtToken {
  token: string;
  userId: number;
  accountId: number;
  subdomain: string;
  isPartner: Nullable<boolean>;
}
