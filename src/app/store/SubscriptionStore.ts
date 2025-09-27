import type { DataStore, Nullable, Subscription, SubscriptionPlan } from '@/shared';
import { makeAutoObservable } from 'mobx';
import { subscriptionApi } from '../api';

class SubscriptionStore implements DataStore {
  subscription: Nullable<Subscription> = null;

  isGettingPortalUrl = false;
  isSubscriptionLoaded = false;
  areSubscriptionPlansLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isTrial(): boolean {
    if (!this.subscription) return false;

    return this.subscription.isTrial;
  }

  get isValid(): boolean {
    if (!this.subscription) return false;

    return this.subscription.isValid;
  }

  loadData = async (): Promise<void> => {
    try {
      this.subscription = await subscriptionApi.getSubscription();
    } catch (e) {
      throw new Error(`Error while loading subscription: ${e}`);
    } finally {
      this.isSubscriptionLoaded = true;
    }
  };

  getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    try {
      this.areSubscriptionPlansLoaded = false;

      return await subscriptionApi.getSubscriptionPlans();
    } catch (e) {
      throw new Error(`Error while loading subscription plans: ${e}`);
    } finally {
      this.areSubscriptionPlansLoaded = true;
    }
  };

  getCheckoutUrl = async ({
    amount,
    priceId,
    productId,
    couponId,
    numberOfUsers,
  }: {
    numberOfUsers: number;
    amount?: number;
    priceId?: string;
    couponId?: string;
    productId?: string;
  }): Promise<string> => {
    try {
      this.isGettingPortalUrl = true;

      return await subscriptionApi.getCheckoutUrl({
        productId,
        amount,
        priceId,
        couponId,
        numberOfUsers,
      });
    } catch (e) {
      throw new Error(`Error while loading subscription plans: ${e}`);
    } finally {
      this.isGettingPortalUrl = false;
    }
  };

  getPortalUrl = async (): Promise<string> => {
    try {
      this.isGettingPortalUrl = true;

      return await subscriptionApi.getPortalUrl();
    } catch (e) {
      throw new Error(`Error while loading subscription plans: ${e}`);
    } finally {
      this.isGettingPortalUrl = false;
    }
  };

  reset = (): void => {
    this.subscription = null;

    this.areSubscriptionPlansLoaded = false;
    this.isGettingPortalUrl = false;
  };
}

export const subscriptionStore = new SubscriptionStore();
