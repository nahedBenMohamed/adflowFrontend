export enum FieldCode {
  // Project field codes
  VALUE = 'value',
  START_DATE = 'start_date',
  END_DATE = 'end_date',
  PARTICIPANTS = 'participants',
  DESCRIPTION = 'description',

  // Analytics field codes
  // UTM subgroup
  UTM_SOURCE = 'utm_source',
  UTM_MEDIUM = 'utm_medium',
  UTM_CAMPAIGN = 'utm_campaign',
  UTM_TERM = 'utm_term',
  UTM_CONTENT = 'utm_content',

  // Google Analytics subgroup
  GA_CLIENT_ID = 'client_id',
  GA_SESSION_ID = 'session_id',
  GA_PAGE_PATH = 'page_path',
  GA_PAGE_TITLE = 'page_title',
  GA_EVENT_CATEGORY = 'event_category',
  GA_EVENT_ACTION = 'event_action',
  GA_EVENT_LABEL = 'event_label',
  GA_SCREEN_RESOLUTION = 'screen_resolution',
  GA_USER_AGENT = 'user_agent',
  GA_LANGUAGE = 'language',
  REFERRER = 'referrer',

  // Yandex.Metrika subgroup
  YM_USER_ID = 'ym_uid',
  YM_SESSION_ID = 'ym_sid',
  YM_REFERRER = 'ym_referrer',
  YM_DEVICE = 'ym_device',
  YM_GEO = 'ym_geo',
  YM_BROWSER = 'ym_browser',
  YM_OS = 'ym_os',

  // Facebook Analytics subgroup
  FB_CAMPAIGN_ID = 'fb_campaign_id',
  FB_ADSET_ID = 'fb_adset_id',
  FB_AD_ID = 'fb_ad_id',
  FB_REFERRAL_URL = 'fb_referral_url',
  FB_EVENT_TYPE = 'fb_event_type',
  FB_USER_ID = 'fb_user_id',

  // Requisites field codes
  // Bank requisites
  BANK_NAME = 'bank_name',
  BANK_BIC = 'bank_bic',
  BANK_SWIFT = 'bank_swift',
  // TIN <-> ИНН
  BANK_TIN = 'bank_tin',
  // TRRC <-> КПП
  BANK_TRRC = 'bank_trrc',
  BANK_CORRESPONDENT_ACCOUNT = 'bank_correspondent_acc',
  BANK_PAYMENT_CITY = 'bank_payment_city',
  // OPF <-> Тип кредитной организации
  BANK_OPF_TYPE = 'bank_opf_type',
  // Расчетный счет
  BANK_CHECKING_ACCOUNT = 'bank_checking_account',

  // IE and organization requisites
  ORG_TIN = 'org_tin',
  ORG_TRRC = 'org_trrc',
  ORG_PSRN = 'org_psrn',
  ORG_TYPE = 'org_type',
  ORG_FULL_NAME = 'org_full_name',
  ORG_SHORT_NAME = 'org_short_name',
  IE_NAME = 'ie_name',
  IE_SURNAME = 'ie_surname',
  IE_PATRONYMIC = 'ie_patronymic',
  ORG_MANAGEMENT_NAME = 'org_management_name',
  ORG_MANAGEMENT_POST = 'org_management_post',
  ORG_MANAGEMENT_START_DATE = 'org_management_start_date',
  ORG_BRANCH_COUNT = 'org_branch_count',
  ORG_BRANCH_TYPE = 'org_branch_type',
  ORG_ADDRESS = 'org_address',
  ORG_REG_DATE = 'org_reg_date',
  ORG_LIQUIDATION_DATE = 'org_liquidation_date',
  ORG_STATUS = 'org_status',

  // IE and organization statistical codes
  ORG_OKATO = 'stat_okato',
  ORG_OKTMO = 'stat_oktmo',
  ORG_OKPO = 'stat_okpo',
  ORG_OKOGU = 'stat_okogu',
  ORG_OKFS = 'stat_okfs',
  ORG_OKVED = 'stat_okved',

  // Additional IE and organization requisites
  ORG_EMPLOYEE_COUNT = 'org_extra_employee_count',
  ORG_FOUNDERS = 'org_extra_founders',
  ORG_MANAGERS = 'org_extra_managers',
  ORG_CAPITAL = 'org_extra_capital',
  ORG_LICENSES = 'org_extra_licenses',
  ORG_PHONES = 'org_extra_phones',
  ORG_EMAILS = 'org_extra_emails',
}
