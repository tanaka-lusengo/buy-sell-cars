"use server";

import { StatusCode } from "~bsc-shared/utils";

const POSTHOG_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY as string;
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const POSTHOG_URL = `https://eu.posthog.com/api/projects/${PROJECT_ID}/query/`;

export type TimeFrame = "7 days" | "30 days" | "90 days" | "1 year";

type PostHogResponse<T = any> = {
  data: T | null;
  status: StatusCode;
  error: string | null;
};

type PostHogQueryPayload =
  | {
      query: {
        kind: "HogQLQuery";
        query: string;
      };
    }
  | {
      query: string;
      params?: any[];
    };

// Generic function to handle PostHog API requests
const executePostHogQuery = async <T = any>(
  payload: PostHogQueryPayload
): Promise<PostHogResponse<T>> => {
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

    // Handle different response structures
    const isSuccess =
      response.ok && (result.results || result.data?.status === "success");
    const data = result.results || result.data || result;

    if (!isSuccess) {
      return {
        data: null,
        status: StatusCode.BAD_REQUEST,
        error: "Failed to execute PostHog query",
      };
    }

    return {
      data,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    console.error("PostHog query error:", error);
    return {
      data: null,
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: "An error occurred while executing PostHog query",
    };
  }
};

export const fetchSponsorAdClicks = async (
  timeFrame: TimeFrame
): Promise<PostHogResponse> => {
  const payload = {
    query: {
      kind: "HogQLQuery" as const,
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

  return executePostHogQuery(payload);
};

export const fetchVehiclePageViewsByOwner = async (
  ownerId: string
): Promise<PostHogResponse> => {
  const payload = {
    query: {
      kind: "HogQLQuery" as const,
      query: `
        SELECT
        *,
        properties.vehicle_id AS vehicle_id,
        properties.vehicle_make AS vehicle_make,
        properties.vehicle_model AS vehicle_model,
        properties.year AS year
        FROM events
        WHERE event = 'vehicle_page_view'
        AND properties.owner_id = '${ownerId}'
      `,
    },
  };

  return executePostHogQuery(payload);
};
