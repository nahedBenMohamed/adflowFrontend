import type { ChatProviderStatus } from '@/modules/multichat';

export interface IntegrationSettingsAccount {
  id: number;
  title: string;
  status: ChatProviderStatus;
  phone?: string;
  onEdit: () => Promise<void>;
  onDelete: () => Promise<void>;
}
