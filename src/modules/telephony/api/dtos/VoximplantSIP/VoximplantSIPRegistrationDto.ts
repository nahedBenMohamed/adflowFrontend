export interface VoximplantSIPRegistrationDto {
  proxy: string;
  userId?: number;
  ruleId?: number;
  authUser?: string;
  ruleName?: string;
  purchaseDate: Date;
  sipUsername: string;
  lastUpdated: number;
  statusCode?: number;
  successful?: string;
  deactivated: boolean;
  errorMessage?: string;
  isPersistent: boolean;
  outboundProxy?: string;
  sipRegistrationId: number;
  subscriptionPrice: string;
}
