import type { Nullable } from '@/shared';

const queryKeys = {
  settings: ['settings'],
  departmentSettings(departmentId: Nullable<number>) {
    return [...this.settings, 'department-settings', departmentId];
  },
  accountApiAccess() {
    return [...this.settings, 'account-api-access'];
  },
  userAccessTokens() {
    return [...this.settings, 'user-access-tokens'];
  },
  myworkBillingPromoPrices() {
    return [...this.settings, 'mywork-billing-promo-prices'];
  },
  currentDiscount() {
    return [...this.settings, 'current-discount'];
  },
  googleCalendarIntegrations() {
    return [...this.settings, 'google-calendar-integrations'];
  },
} as const;

export const SETTINGS_QUERY_KEYS = Object.freeze(queryKeys);
