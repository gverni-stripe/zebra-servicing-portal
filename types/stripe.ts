import Stripe from 'stripe';

export interface ConnectedAccountData {
  id: string;
  business_profile: {
    name?: string | null;
  } | null;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  details_submitted: boolean;
  requirements: {
    currently_due: string[] | null;
    past_due: string[] | null;
    disabled_reason: string | null;
  } | null;
}

export type StripeAccount = Stripe.Account;
