import { Subscription } from "@/src/types";

/**
 * Check if a subscription represents an active trial
 */
export const hasActiveTrialAccess = (
  subscription: Subscription | null
): boolean => {
  if (!subscription?.trial_end_date) {
    return false;
  }

  const now = new Date();
  const trialEnd = new Date(subscription.trial_end_date);

  return now <= trialEnd && subscription.status === "active";
};

/**
 * Check if a trial subscription has expired
 */
export const hasTrialExpired = (subscription: Subscription | null): boolean => {
  if (!subscription?.trial_end_date) {
    return false;
  }

  const now = new Date();
  const trialEnd = new Date(subscription.trial_end_date);

  return now > trialEnd;
};

/**
 * Get remaining trial days (returns 0 if expired or not a trial)
 */
export const getRemainingTrialDays = (
  subscription: Subscription | null
): number => {
  if (!subscription?.is_trial || !subscription.trial_end_date) {
    return 0;
  }

  const now = new Date();
  const trialEnd = new Date(subscription.trial_end_date);

  if (now > trialEnd) {
    return 0;
  }

  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return Math.max(0, diffDays);
};

/**
 * Generate a 14-day trial end date from now
 */
export const generateTrialEndDate = (): string => {
  const now = new Date();
  const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // 14 days
  return trialEnd.toISOString();
};

/**
 * Check if subscription is a trial (regardless of expiration)
 */
export const isTrialSubscription = (
  subscription: Subscription | null
): boolean => {
  return Boolean(subscription?.is_trial);
};
