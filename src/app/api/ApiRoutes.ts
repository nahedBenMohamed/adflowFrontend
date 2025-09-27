export enum ApiRoutes {
  /* IAM START */

  // subscription
  GET_SUBSCRIPTION = '/api/iam/subscriptions',
  GET_SUBSCRIPTION_FOR_ACCOUNT = '/api/iam/subscriptions/:accountId',
  GET_SUBSCRIPTION_PLANS = '/api/iam/subscriptions/stripe/plans',
  GET_SUBSCRIPTION_CHECKOUT_URL = '/api/iam/subscriptions/stripe/checkout',
  GET_SUBSCRIPTION_PORTAL_URL = '/api/iam/subscriptions/stripe/portal',
  GET_CURRENT_DISCOUNT = '/api/iam/subscriptions/discount/current',
  UPDATE_SUBSCRIPTION = '/api/iam/subscriptions/:accountId',
  // users
  GET_USERS = '/api/iam/users',
  GET_USER = '/api/iam/users/:id',
  ADD_USER = '/api/iam/users',
  UPDATE_USER = '/api/iam/users/:id',
  DELETE_USER = '/api/iam/users/:id',
  UPLOAD_USER_AVATAR = '/api/iam/users/:id/avatar',
  REMOVE_USER_AVATAR = '/api/iam/users/:id/avatar',
  CHANGE_USER_PASSWORD = '/api/iam/users/change-password',
  // user profile
  GET_USER_PROFILE = '/api/iam/users/:id/profile',
  UPDATE_USER_PROFILE = '/api/iam/users/:id/profile',

  /* IAM END */

  // builder
  ADD_ENTITY_TYPE = '/api/crm/entity-types',
  GET_FEATURES = '/api/crm/features',
  // feed
  GET_FEED_ITEMS = '/api/crm/entities/:entityId/events/:filter',
  // entity types
  GET_ENTITY_TYPES = '/api/crm/entity-types',
  GET_ENTITY_TYPE = '/api/crm/entity-types/:id',
  DELETE_ENTITY_TYPE = '/api/crm/entity-types/:id',
  UPDATE_ENTITY_TYPE = '/api/crm/entity-types/:id',
  UPDATE_ENTITY_TYPE_FIELDS = '/api/crm/entity-types/:id/fields',
  UPDATE_FIELDS_SETTINGS = '/api/crm/entity-types/:entityTypeId/fields-settings',
  // identity
  GET_ALL_IDENTITY_POOLS = '/api/crm/identities/all',
  GET_IDENTITY_POOL = '/api/crm/identities/:name',
  // boards
  GET_BOARDS = '/api/crm/boards',
  GET_BOARD = '/api/crm/boards/:id',
  ADD_BOARD = '/api/crm/boards',
  UPDATE_BOARD = '/api/crm/boards/:id',
  DELETE_BOARD = '/api/crm/boards/:id',
  // stages
  CREATE_STAGE = '/api/crm/boards/:boardId/stages',
  GET_STAGES = '/api/crm/boards/:boardId/stages',
  UPDATE_STAGE = '/api/crm/boards/:boardId/stages/:stageId',
  GET_STAGE = '/api/crm/boards/:boardId/stages/:stageId',
  DELETE_STAGE = '/api/crm/boards/:boardId/stages/:stageId',
  // storage
  GET_FILE_INFO = '/api/storage/info/:fileId',
  UPLOAD_FILES = '/api/storage/upload',
  DELETE_FILE = '/api/storage/file/:id',
  DELETE_FILE_LINK = '/api/crm/file-link/:id',
  DELETE_FILE_LINKS = '/api/crm/file-links',
  // form
  SEND_CONTACT_US_FORM = '/api/forms/contact-us',
  // account
  CREATE_ACCOUNT = '/api/iam/account',
  GET_ACCOUNT = '/api/iam/account',
  SEARCH_ACCOUNTS = '/api/iam/account/search',
  UPLOAD_ACCOUNT_LOGO = '/api/iam/account/logo',
  REMOVE_ACCOUNT_LOGO = '/api/iam/account/logo',
  GET_ACCOUNT_SETTINGS = '/api/iam/account/settings',
  UPDATE_ACCOUNT_SETTINGS = '/api/iam/account/settings',
  // general settings
  GET_DEMO_DATA_EXISTS = '/api/setup/demo-data/exists',
  DELETE_DEMO_DATA = '/api/setup/demo-data',
  // version
  GET_LATEST_FRONTEND_VERSION = '/api/support/version/frontend/latest',
  // frontend objects
  GET_FRONTEND_OBJECT = '/api/frontend/objects/:key',
  UPSERT_FRONTEND_OBJECT = '/api/frontend/objects',
  DELETE_FRONTEND_OBJECT = '/api/frontend/objects/:key',
  // dadata
  // proxy on https://dadata.ru/api/
  GET_BANK_REQUISITES = '/api/data-enrichment/requisites/bank',
  GET_ORG_REQUISITES = '/api/data-enrichment/requisites/org',
}
