export enum FieldsApiRoutes {
  GET_FIELD_SETTINGS = '/api/crm/entity-types/:entityTypeId/fields/settings',
  UPDATE_FIELD_SETTINGS = '/api/crm/entity-types/:entityTypeId/fields/:fieldId/settings',
  CHECK_FIELD_FORMULA = '/api/crm/fields/formula/check',
  GET_AGGREGATED_PHONE_USER_INFO = '/api/data-enrichment/phone/aggregate',
}
