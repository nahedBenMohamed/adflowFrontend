import { baseApi, subscriptionStore } from '@/app';
import { authStore } from '@/modules/auth';
import Cookies from 'js-cookie';
import TagManager from 'react-gtm-module';
import { type Optional } from '../types';
import { UuidUtil } from './UuidUtil';

const MAX_ATTEMPTS = 50;
const GA_USER_ID = 'gaUserId';
const GA_CLIENT_ID_REQ_HEADER = 'ga-client-id';

export class GTMUtil {
  static initializeGTM(): void {
    if (import.meta.env.VITE_GTM_ID) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      this.setAnalyticsConsent({ type: 'default', consent: 'denied' });

      const userId = GTMUtil.getGAUserId();

      TagManager.initialize({
        gtmId: import.meta.env.VITE_GTM_ID,
        dataLayer: {
          user_id: userId,
        },
      });
      this.setAnalyticsConsent({ type: 'update', consent: 'granted' });

      let attempts = 0;

      // clientId might not be available immediately, so we need to make multiple attempts to get it
      const checkClientId = setInterval(() => {
        const clientId = GTMUtil.getGAFromCookie();

        if (clientId) {
          baseApi.setRequestHeader({ [GA_CLIENT_ID_REQ_HEADER]: clientId });

          clearInterval(checkClientId);
        } else if (attempts >= MAX_ATTEMPTS) {
          clearInterval(checkClientId);
        }

        attempts++;
      }, 100);
    }
  }

  private static getGAFromCookie(): Optional<string> {
    const gaCookie = Cookies.get('_ga');

    return gaCookie ? gaCookie.split('.').slice(2).join('.') : undefined;
  }

  static getGAUserId(): string {
    let userId = localStorage.getItem(GA_USER_ID);

    if (!userId) {
      userId = UuidUtil.generate();

      GTMUtil.setGAUserId(userId);
    }

    return userId;
  }

  static setGAUserId(gaUserId: string): void {
    localStorage.setItem(GA_USER_ID, gaUserId);
  }

  static setupDataLayer(accountId: number, userId: number, userAnalyticsId: string): void {
    GTMUtil.setGAUserId(userAnalyticsId);

    if (window.dataLayer) {
      window.dataLayer.push({
        account_id: accountId,
        account_user_id: userId,
        user_id: userAnalyticsId,
      });
    }
  }

  static sendAnalyticsEvent(
    event: string,
    params?: Record<string, Optional<string | number | boolean>>
  ): void {
    const { user, accountId } = authStore;

    const userId = GTMUtil.getGAUserId();
    const subscriptionName =
      subscriptionStore.subscription && !subscriptionStore.subscription.isTrial
        ? subscriptionStore.subscription.planName
        : 'Trial';

    if (window.dataLayer) {
      window.dataLayer.push({
        event: event,
        account_id: accountId,
        account_user_id: user?.id,
        user_id: userId,
        account_tariff: subscriptionName,
        ...params,
      });
    }
  }

  private static setAnalyticsConsent = ({
    type,
    consent,
  }: {
    type: 'default' | 'update';
    consent: 'denied' | 'granted';
  }): void => {
    if (window.gtag) {
      window.gtag('consent', type, {
        ad_storage: consent,
        ad_user_data: consent,
        ad_personalization: consent,
        analytics_storage: consent,
        functionality_storage: consent,
        personalization_storage: consent,
        security_storage: consent,
      });
    }
  };
}
