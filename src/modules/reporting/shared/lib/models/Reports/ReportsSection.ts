// linked with translations, change carefully
export enum ReportsSection {
  // General report
  USERS = 'users',
  RATING = 'rating',
  GROUPS = 'groups',

  // Comparative report
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
  QUARTERS = 'quarters',
  YEARS = 'years',

  // Telephony report
  TELEPHONY_USERS = 'callsUsers',
  TELEPHONY_GROUPS = 'callsGroups',
  CALL_HISTORY = 'callHistory',

  // Schedule report
  SCHEDULE_CLIENT = 'scheduleClient',
  SCHEDULE_DEPARTMENT = 'scheduleDepartment',
  SCHEDULE_OWNER = 'scheduleOwner',
  SCHEDULE_PERFORMER = 'schedulePerformer',

  // Customer report
  CUSTOMER_CONTACT = 'customerContact',
  CUSTOMER_COMPANY = 'customerCompany',
  CUSTOMER_CONTACT_COMPANY = 'customerContactCompany',

  // Products general report
  PRODUCTS = 'products',
  PRODUCTS_CATEGORIES = 'productsCategories',
  PRODUCTS_USERS = 'productsUsers',
}
