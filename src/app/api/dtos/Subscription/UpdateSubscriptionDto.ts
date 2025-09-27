export interface UpdateSubscriptionDto {
  isTrial?: boolean;
  periodStart?: string;
  periodEnd?: string;
  userLimit?: number;
  planName?: string;
  externalCustomerId?: string | null;
  firstVisit?: string;
}
