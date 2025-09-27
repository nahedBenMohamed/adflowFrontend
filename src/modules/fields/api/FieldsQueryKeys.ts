const queryKeys = {
  fields: ['fields'],
  fieldSettings(entityTypeId: number) {
    return [...this.fields, 'field-settings', entityTypeId];
  },
  phoneUserInfo(phone: string) {
    return [...this.fields, 'phone-user-info', phone];
  },
} as const;

export const FIELDS_QUERY_KEYS = Object.freeze(queryKeys);
