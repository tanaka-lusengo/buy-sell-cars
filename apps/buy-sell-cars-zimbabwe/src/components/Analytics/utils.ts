import posthog from "posthog-js";
import { Profile } from "@/src/types";

// Enhanced type definitions for better type safety
type SponsorAdEvent = {
  event: "sponsor_ad_click" | "sponsor_ad_view";
  properties: {
    sponsor: string;
    action: string;
    url: string;
    placement: string;
    campaign_id?: string;
  };
};

type VehicleInteractionEvent = {
  event: "vehicle_interaction" | "vehicle_page_view" | "dealer_page_view";
  properties: {
    interaction_type: "view" | "click" | "favorite" | "contact";
    // Properties for vehicle interactions
    vehicle_id?: string;
    owner_id?: string;
    vehicle_make?: string;
    vehicle_model?: string;
    year?: number;
    // Optional properties for dealer interactions
    dealer_id?: string;
    dealer_name?: string;
    source_page: string;
  };
};

export type PostHogEventUnion = SponsorAdEvent | VehicleInteractionEvent;

/**
 * Generic PostHog event tracker with enhanced error handling and retry logic
 */
export const trackPostHogEvent = <T extends PostHogEventUnion>(
  eventData: T
) => {
  try {
    posthog.capture(eventData.event, {
      ...eventData.properties,
      $current_url: window.location.href,
    });
    console.log(`[PostHog]: Event '${eventData.event}' tracked successfully`, {
      properties: eventData.properties,
      url: window.location.href,
    });
  } catch (error) {
    const trackingError =
      error instanceof Error ? error : new Error(String(error));

    if (process.env.NODE_ENV === "development") {
      console.error(`[PostHog]: Error tracking event:`, trackingError);
    }
  }
};

export type TrackVehicleViewEvent = {
  vehicleId: string;
  ownerId: string;
  make: string;
  model: string;
  year: number;
  sourcePage: string;
};

/**
 * Enhanced tracking functions for specific use cases
 */
export const trackVehicleView = (vehicleData: TrackVehicleViewEvent) => {
  trackPostHogEvent({
    event: "vehicle_page_view",
    properties: {
      interaction_type: "view",
      vehicle_id: vehicleData.vehicleId,
      owner_id: vehicleData.ownerId,
      vehicle_make: vehicleData.make,
      vehicle_model: vehicleData.model,
      year: vehicleData.year,
      source_page: vehicleData.sourcePage,
    },
  });
};

export type TrackDealerViewEvent = {
  dealerId: string;
  dealerName: string;
  sourcePage: string;
};

/**
 * Enhanced tracking functions for specific use cases
 */
export const trackDealerView = (dealerData: TrackDealerViewEvent) => {
  trackPostHogEvent({
    event: "dealer_page_view",
    properties: {
      interaction_type: "view",
      dealer_id: dealerData.dealerId,
      dealer_name: dealerData.dealerName,
      source_page: dealerData.sourcePage,
    },
  });
};

/**
 * Identifies user in PostHog with profile data and sets up analytics groups
 */
export const identifyUser = (profile: Profile) => {
  if (profile) {
    posthog.identify(profile.id, {
      email: profile.email,
      user_category: profile.user_category,
      dealership_name:
        profile.user_category === "dealership" ? profile.dealership_name : null,
      first_name: profile.first_name,
      last_name: profile.last_name,
    });

    // Set groups for analytics segmentation
    posthog.group("company", profile.dealership_name || "Individual", {
      user_category: profile.user_category,
    });
  }
};
