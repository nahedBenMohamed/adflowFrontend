import { UpdateSubscriptionDto } from '@/app';
import { CurrentDiscount } from '@/modules/settings';
import { Nullable, UrlTemplateUtil } from '@/shared';
import { Subscription } from '../../../shared/lib/models/Subscription/Subscription';
import { SubscriptionPlan } from '../../../shared/lib/models/Subscription/SubscriptionPlan';
import { ApiRoutes } from '../ApiRoutes';
import { baseApi } from '../BaseApi/BaseApi';

class SubscriptionApi {
  getSubscription = async (): Promise<Subscription> => {
    const response = await baseApi.get(ApiRoutes.GET_SUBSCRIPTION);

    return Subscription.fromDto(response.data);
  };

  getSubscriptionForAccount = async (id: number): Promise<Subscription> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(ApiRoutes.GET_SUBSCRIPTION_FOR_ACCOUNT, { accountId: id })
    );

    return Subscription.fromDto(response.data);
  };

  getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    const response = await baseApi.get(ApiRoutes.GET_SUBSCRIPTION_PLANS);

    return SubscriptionPlan.fromDtos(response.data);
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
    const response = await baseApi.get(ApiRoutes.GET_SUBSCRIPTION_CHECKOUT_URL, {
      params: { productId, amount, priceId, couponId, numberOfUsers },
    });

    return response.data;
  };

  getPortalUrl = async (): Promise<string> => {
    const response = await baseApi.get(ApiRoutes.GET_SUBSCRIPTION_PORTAL_URL);

    return response.data;
  };

  getCurrentDiscount = async (): Promise<Nullable<CurrentDiscount>> => {
    const response = await baseApi.get(ApiRoutes.GET_CURRENT_DISCOUNT);

    return response.data ? CurrentDiscount.fromDto(response.data) : null;
  };

  updateSubscription = async ({
    accountId,
    dto,
  }: {
    accountId: number;
    dto: UpdateSubscriptionDto;
  }): Promise<Subscription> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(ApiRoutes.UPDATE_SUBSCRIPTION, { accountId }),
      dto
    );

    return Subscription.fromDto(response.data);
  };
}

export const subscriptionApi = new SubscriptionApi();
