import type { Optional } from '@/shared';
import { envUtil } from '@/shared/lib/utils/EnvUtil';
import { createDirectus, readItems, rest, type RestClient, staticToken } from '@directus/sdk';
import type { LifetimeDealPricingPlan } from '../../shared';

interface DirectusSchema {
  ltd_promo_prices: LifetimeDealPricingPlan[];
}

class BillingLifetimePromoApi {
  private api: Optional<RestClient<DirectusSchema>>;

  constructor() {
    const url = envUtil.directusPublicBaseUrl;
    const token = envUtil.directusStaticToken;

    if (url && token) this.api = createDirectus(url).with(staticToken(token)).with(rest());
  }

  getActualLifetimeDealPrices = async (): Promise<LifetimeDealPricingPlan[]> => {
    try {
      if (this.api) {
        return await this.api.request(readItems('ltd_promo_prices'));
      } else {
        return [];
      }
    } catch (e) {
      console.error(`Error while getting actual lifetime deal prices from CMS: ${e}`);

      return [];
    }
  };
}

export const billingLifetimePromoApi = new BillingLifetimePromoApi();
