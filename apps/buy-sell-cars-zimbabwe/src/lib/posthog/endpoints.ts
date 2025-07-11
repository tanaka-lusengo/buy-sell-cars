"use server";

import { StatusCode } from "~bsc-shared/utils";

const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const POSTHOG_URL = `https://eu.posthog.com/api/projects/${PROJECT_ID}/query/`;

// Assuming you have an API endpoint set up to handle SQL queries
export type TimeFrame = "7 days" | "30 days" | "90 days" | "1 year";

export const fetchSponsorAdClicks = async (timeFrame: TimeFrame) => {
  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `
        SELECT
        event,
        properties.placement AS placement,
        properties.sponsor AS sponsor
        FROM events
        WHERE event = 'sponsor_ad_click'
        AND timestamp >= now() - interval '${timeFrame}'
      `,
    },
  };

  try {
    const response = await fetch(POSTHOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POSTHOG_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok || !result.results) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to fetch sponsor ad clicks",
      };
    }

    return {
      data: result.results,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching sponsor ad clicks:", error);
    return {
      data: null,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: "An error occurred while fetching sponsor ad clicks",
    };
  }
};

export const fetchVehiclePageViewsByOwner = async (ownerId: string) => {
  const query = `
    SELECT
    *,
    properties.vehicle_id AS vehicle_id,
    properties.vehicle_make AS vehicle_make,
    properties.vehicle_model AS vehicle_model,
    properties.year AS year,
    FROM events
    WHERE event = 'vehicle_page_view'
    AND properties.owner_id = $1
  `;

  try {
    const response = await fetch(POSTHOG_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POSTHOG_API_KEY}`,
      },
      body: JSON.stringify({ query, params: [ownerId] }),
    });

    const result = await response.json();

    if (!response.ok || result.data.status !== "success") {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to fetch vehicle page views",
      };
    }

    return {
      data: result,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching vehicle page views:", error);
    return {
      data: null,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: "An error occurred while fetching vehicle page views",
    };
  }
};
