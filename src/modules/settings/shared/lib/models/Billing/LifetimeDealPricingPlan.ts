import type { Optional } from '@/shared';

export interface LifetimeDealPricingPlan {
  users: number;

  // Price on ”starter” lifetime plan, use only old_price, because this is the reference price
  // for discount calculation
  ltd_business: Optional<number>;
  ltd_business_old_price: Optional<number>;

  // Price on ”business” lifetime plan, use only old_price, because this is the reference price
  // for discount calculation
  ltd_advanced: Optional<number>;
  ltd_advanced_old_price: Optional<number>;

  // Price on ”Starter” yearly plan, year is the actual price, month is yearly price per month,
  // and savings is just for promo purposes
  business_year: Optional<number>;
  business_month: Optional<number>;
  business_savings: Optional<number>;

  // Price on ”Business” yearly plan, year is the actual price, month is yearly price per month,
  // and savings is just for promo purposes
  advanced_year: Optional<number>;
  advanced_month: Optional<number>;
  advanced_savings: Optional<number>;
}
