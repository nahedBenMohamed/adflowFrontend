export enum SettingsApiRoutes {
  // departments settings
  GET_DEPARTMENTS = '/api/iam/departments',
  GET_DEPARTMENTS_SETTINGS = '/api/iam/departments/:id/settings',
  ADD_DEPARTMENT = '/api/iam/departments',
  UPDATE_DEPARTMENT = '/api/iam/departments/:id',
  DELETE_DEPARTMENT = '/api/iam/departments/:id',
  // salesforce
  SF_GET_SETTINGS = '/api/integration/salesforce/settings',
  SF_ADD_SETTINGS = '/api/integration/salesforce/settings',
  SF_DELETE_SETTINGS = '/api/integration/salesforce/settings/:id',
  SF_CONNECT = '/api/integration/salesforce/auth/connect/:id',
  SF_DISCONNECT = '/api/integration/salesforce/auth/disconnect/:id',
  // document templates
  GET_DOCUMENT_TEMPLATES = '/api/crm/documents/templates',
  GET_DOCUMENT_TEMPLATE = '/api/crm/documents/templates/:id',
  ADD_DOCUMENT_TEMPLATE = '/api/crm/documents/templates',
  DELETE_DOCUMENT_TEMPLATE = '/api/crm/documents/templates/:id',
  UPDATE_DOCUMENT_TEMPLATE = '/api/crm/documents/templates/:id',
  // api access
  CREATE_API_ACCESS = '/api/iam/account/api-access',
  GET_API_ACCESS = '/api/iam/account/api-access',
  RECREATE_API_ACCESS = '/api/iam/account/api-access',
  DELETE_API_ACCESS = '/api/iam/account/api-access',
  // user auth tokens
  CREATE_USER_ACCESS_TOKEN = '/api/iam/users/my/tokens',
  GET_USER_ACCESS_TOKENS = '/api/iam/users/my/tokens',
  DELETE_USER_ACCESS_TOKEN = '/api/iam/users/my/tokens/:tokenId',
  // user calendar
  CREATE_USER_CALENDAR = '/api/iam/users/:userId/calendar',
  GET_USER_CALENDAR = '/api/iam/users/:userId/calendar',
  UPDATE_USER_CALENDAR = '/api/iam/users/:userId/calendar',
  DELETE_USER_CALENDAR = '/api/iam/users/:userId/calendar',
  // google calendar integration
  GOOGLE_CALENDAR_AUTHORIZE_URL = '/api/integration/google/calendar/authorize-url',
  GOOGLE_CALENDAR_PROCESS_CODE = '/api/integration/google/calendar/process-code',
  GET_GOOGLE_CALENDAR_INTEGRATIONS = '/api/integration/google/calendar',
  GET_GOOGLE_CALENDAR_INTEGRATION = '/api/integration/google/calendar/:calendarId',
  CREATE_GOOGLE_CALENDAR_INTEGRATION = '/api/integration/google/calendar',
  UPDATE_GOOGLE_CALENDAR_INTEGRATION = '/api/integration/google/calendar/:calendarId',
  DELETE_API_ACCESS_GOOGLE_CALENDAR_INTEGRATION = '/api/integration/google/calendar/:calendarId',
}
