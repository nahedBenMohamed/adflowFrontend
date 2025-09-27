export interface UserTokenDto {
  id: number;
  name: string;
  createdAt: string;
  expiresAt?: string;
  lastUsedAt?: string;
}
