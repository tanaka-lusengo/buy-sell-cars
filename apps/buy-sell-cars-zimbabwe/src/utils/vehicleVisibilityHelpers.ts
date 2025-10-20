import { Subscription } from "@/src/types";
import { hasTrialExpired } from "./trialHelpers";

/**
 * Determine if a vehicle should be visible on public pages
 * Vehicles are hidden if:
 * - Owner has expired trial subscription (applies to paid plans only)
 * - Owner is dealership with no active subscription
 * Community Access subscriptions are always visible (permanent plan)
 */
export const shouldVehicleBeVisible = (
  ownerSubscription: Subscription | null,
  ownerCategory: "individual" | "dealership" | null,
  ownerProfileShowVehicles: boolean | null
): boolean => {
  // Manual override: always show vehicles if set
  if (ownerProfileShowVehicles) {
    return true;
  }

  // Always show vehicles from individual users (they get free access)
  if (ownerCategory === "individual") {
    return true;
  }

  // For dealership users, check subscription status
  if (ownerCategory === "dealership") {
    // No subscription - hide vehicles
    if (!ownerSubscription) {
      return false;
    }

    // Active paid subscription or Community Access - show vehicles
    // Community Access has is_trial = false and no expiration
    if (!ownerSubscription.is_trial && ownerSubscription.status === "active") {
      return true;
    }

    // Active trial (for other paid plans) - show vehicles if not expired
    if (
      ownerSubscription.is_trial &&
      ownerSubscription.status === "active" &&
      !hasTrialExpired(ownerSubscription)
    ) {
      return true;
    }

    // Expired trial - hide vehicles
    if (ownerSubscription.is_trial && hasTrialExpired(ownerSubscription)) {
      return false;
    }
  }

  // Default to hiding if we can't determine status
  return false;
};

/**
 * Determine if a user should have access to dashboard features
 * Users are allowed access if:
 * - show_vehicles is explicitly set to true (manual override)
 * - Individual users (get free access)
 * - Dealership users with active subscription (including Community Access)
 */
export const shouldAllowDashboardAccess = (
  profile: {
    show_vehicles?: boolean | null;
    user_category?: "individual" | "dealership" | null;
  },
  subscription: Subscription | null
): boolean => {
  // Manual override: always allow access if show_vehicles is true
  if (profile.show_vehicles === true) {
    return true;
  }

  // Always allow access for individual users (they get free access)
  if (profile.user_category === "individual") {
    return true;
  }

  // For dealership users, check subscription status
  if (profile.user_category === "dealership") {
    // No subscription - deny access
    if (!subscription) {
      return false;
    }

    // Active paid subscription or Community Access - allow access
    // Community Access has is_trial = false and no expiration
    if (!subscription.is_trial && subscription.status === "active") {
      return true;
    }

    // Active trial (for paid plans) - allow access if not expired
    if (
      subscription.is_trial &&
      subscription.status === "active" &&
      !hasTrialExpired(subscription)
    ) {
      return true;
    }

    // Expired trial or inactive subscription - deny access
    return false;
  }

  // Default to denying access if we can't determine status
  return false;
};

/**
 * Get vehicle status message for dashboard display
 */
export const getVehicleStatusMessage = (
  subscription: Subscription | null,
  userCategory: "individual" | "dealership" | null,
  vehicleCount: number
): {
  status: "visible" | "hidden" | "partial";
  message: string;
  showUpgradePrompt: boolean;
} => {
  if (userCategory === "individual") {
    return {
      status: "visible",
      message: `All (${vehicleCount}) vehicles are visible on the site`,
      showUpgradePrompt: false,
    };
  }

  if (!subscription) {
    return {
      status: "hidden",
      message: `All (${vehicleCount}) vehicles are hidden from the site. Subscribe to make them visible.`,
      showUpgradePrompt: true,
    };
  }

  if (subscription.is_trial && hasTrialExpired(subscription)) {
    return {
      status: "hidden",
      message: `All (${vehicleCount}) vehicles are hidden from the site. Your trial has expired - upgrade to make them visible again.`,
      showUpgradePrompt: true,
    };
  }

  if (subscription.is_trial && !hasTrialExpired(subscription)) {
    return {
      status: "visible",
      message: `All (${vehicleCount}) vehicles are visible during your trial period`,
      showUpgradePrompt: false,
    };
  }

  // Active subscription (paid or Community Access - both have is_trial = false)
  if (!subscription.is_trial && subscription.status === "active") {
    return {
      status: "visible",
      message: `All (${vehicleCount}) vehicles are visible on the site`,
      showUpgradePrompt: false,
    };
  }

  return {
    status: "hidden",
    message: `All (${vehicleCount}) vehicles are currently hidden from the site`,
    showUpgradePrompt: true,
  };
};
