import { FieldCode } from './Field/FieldCode';

export enum AnalyticsFieldSubgroupCode {
  UTM = 'utm',
  GOOGLE = 'google',
  YANDEX = 'yandex',
  FACEBOOK = 'facebook',
}

export const AnalyticsFieldSubgroup: Readonly<Record<AnalyticsFieldSubgroupCode, FieldCode[]>> =
  Object.freeze({
    [AnalyticsFieldSubgroupCode.UTM]: [
      FieldCode.UTM_SOURCE,
      FieldCode.UTM_MEDIUM,
      FieldCode.UTM_CAMPAIGN,
      FieldCode.UTM_TERM,
      FieldCode.UTM_CONTENT,
    ],

    [AnalyticsFieldSubgroupCode.GOOGLE]: [
      FieldCode.GA_CLIENT_ID,
      FieldCode.GA_SESSION_ID,
      FieldCode.GA_PAGE_PATH,
      FieldCode.GA_PAGE_TITLE,
      FieldCode.GA_EVENT_CATEGORY,
      FieldCode.GA_EVENT_ACTION,
      FieldCode.GA_EVENT_LABEL,
      FieldCode.GA_SCREEN_RESOLUTION,
      FieldCode.GA_USER_AGENT,
      FieldCode.GA_LANGUAGE,
      FieldCode.REFERRER,
    ],

    [AnalyticsFieldSubgroupCode.YANDEX]: [
      FieldCode.YM_USER_ID,
      FieldCode.YM_SESSION_ID,
      FieldCode.YM_REFERRER,
      FieldCode.YM_DEVICE,
      FieldCode.YM_GEO,
      FieldCode.YM_BROWSER,
      FieldCode.YM_OS,
    ],

    [AnalyticsFieldSubgroupCode.FACEBOOK]: [
      FieldCode.FB_CAMPAIGN_ID,
      FieldCode.FB_ADSET_ID,
      FieldCode.FB_AD_ID,
      FieldCode.FB_REFERRAL_URL,
      FieldCode.FB_EVENT_TYPE,
      FieldCode.FB_USER_ID,
    ],
  });
