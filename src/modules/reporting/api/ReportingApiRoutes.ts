export enum ReportingApiRoutes {
  // dashboard
  GET_SALES_PLAN_REPORT = '/api/crm/entity-types/:entityTypeId/dashboard/sales-plan',
  GET_RATING = '/api/crm/entity-types/:entityTypeId/dashboard/rating',
  GET_TOP_SELLERS = '/api/crm/entity-types/:entityTypeId/dashboard/top-sellers',
  GET_ENTITY_SUMMARY_REPORT = '/api/crm/entity-types/:entityTypeId/dashboard/summary/entities',
  GET_TASKS_SUMMARY_REPORT = '/api/crm/entity-types/:entityTypeId/dashboard/summary/tasks',
  GET_ACTIVITIES_SUMMARY_REPORT = '/api/crm/entity-types/:entityTypeId/dashboard/summary/activities',
  GET_PIPELINE_REPORT = '/api/crm/entity-types/:entityTypeId/dashboard/pipeline',
  // goal settings
  GET_USERS_GOALS = '/api/crm/entity-types/:entityTypeId/sales-plans/settings',
  GET_SALES_PLANS = '/api/crm/entity-types/:entityTypeId/sales-plans',
  UPDATE_USERS_GOALS = '/api/crm/entity-types/:entityTypeId/sales-plans/settings',
  DELETE_USER_GOALS = '/api/crm/entity-types/:entityTypeId/sales-plans/settings/users/:userId',
  DELETE_ALL_GOALS = '/api/crm/entity-types/:entityTypeId/sales-plans/settings',
  // reports
  GET_GENERAL_REPORT = '/api/crm/reporting/general',
  GET_COMPARATIVE_REPORT = '/api/crm/reporting/comparative',
  GET_TELEPHONY_REPORT = '/api/telephony/voximplant/reporting/call',
  GET_CALL_HISTORY = '/api/telephony/voximplant/reporting/call/history',
  GET_PROJECT_TASK_USER_REPORT = '/api/crm/reporting/project/users',
  GET_PROJECT_ENTITIES_REPORT = '/api/crm/reporting/project/entities',
  GET_SCHEDULE_REPORT = '/api/scheduler/reporting/schedule',
  GET_CUSTOMER_REPORT = '/api/crm/reporting/customer',
  GET_PRODUCTS_GENERAL_REPORT = '/api/products/reporting/general',
}
