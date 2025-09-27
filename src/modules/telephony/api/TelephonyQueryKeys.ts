import type { Nullable } from '@/shared';

const queryKeys = {
  telephony: ['telephony'],
  voximplant() {
    return [...this.telephony, 'voximplant'];
  },
  calls() {
    return [...this.voximplant(), 'calls'];
  },
  users() {
    return [...this.voximplant(), 'users'];
  },
  userSIPSettings(userId: number) {
    return [...this.users(), userId, 'sip-settings'];
  },
  voximplantAvailablePhoneNumbers() {
    return [...this.voximplant(), 'numbers-available'];
  },
  voximplantPhoneNumbers(accessibleUserId?: number) {
    const key = [...this.voximplant(), 'numbers', accessibleUserId];

    if (accessibleUserId) key.push(accessibleUserId);

    return key;
  },
  voximplantSIPRegistrations(accessibleUserId?: number) {
    return [...this.voximplant(), 'sip-registrations', accessibleUserId];
  },
  voximplantSIPRegistrationsExpanded(accessibleUserId?: number) {
    return [...this.voximplant(), 'sip-registrations', 'expanded', accessibleUserId];
  },
  voximplantSIPRegistrationByExternalId(externalId: Nullable<number>) {
    return [...this.voximplantSIPRegistrations(), 'external-id', externalId];
  },
} as const;

export const TELEPHONY_QUERY_KEYS = Object.freeze(queryKeys);
