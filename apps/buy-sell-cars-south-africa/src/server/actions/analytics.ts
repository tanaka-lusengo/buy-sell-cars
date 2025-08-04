"use server";

import { handleServerError, StatusCode } from "~bsc-shared/utils";
import { createClient } from "@/supabase/server";

type LogProfileViewParams = {
  sourcePage: string;
  profileOwnerId: string;
  viewerId?: string;
};

export const logProfileView = async ({
  sourcePage,
  profileOwnerId,
  viewerId,
}: LogProfileViewParams) => {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("profile_views").insert([
      {
        source_page: sourcePage,
        profile_owner_id: profileOwnerId,
        viewer_id: viewerId ?? "anonymous",
      },
    ]);

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "logging profile view (server)");
  }
};

type LogAdClickParams = {
  vehicleId: string;
  vehicleOwnerId: string;
  sourcePage: string;
  viewerId?: string;
};

export const logAdClick = async ({
  vehicleId,
  vehicleOwnerId,
  sourcePage,
  viewerId,
}: LogAdClickParams) => {
  if (!vehicleId || !vehicleOwnerId)
    return {
      status: StatusCode.UNAUTHORIZED,
      error: "Missing Ids",
    };

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("vehicle_ad_clicks").insert([
      {
        vehicle_id: vehicleId,
        vehicle_owner_id: vehicleOwnerId,
        source_page: sourcePage,
        viewer_id: viewerId ?? "anonymous",
      },
    ]);

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "logging vehicle ad click (server)");
  }
};

export const addFavourite = async (profileId: string, vehicleId: string) => {
  if (!profileId || !vehicleId)
    return {
      status: StatusCode.UNAUTHORIZED,
      error: "Missing Ids",
    };

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("vehicle_favourites").insert([
      {
        profile_id: profileId,
        vehicle_id: vehicleId,
      },
    ]);

    // Handle duplicate (already favourited)
    if (error?.code === "23505") {
      return { status: StatusCode.UNAUTHORIZED, error: "Already favourited" };
    }

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "favouriting ad (server)");
  }
};

export const removeFavourite = async (profileId: string, vehicleId: string) => {
  if (!profileId || !vehicleId)
    return {
      status: StatusCode.UNAUTHORIZED,
      error: "Missing Ids",
    };

  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("vehicle_favourites")
      .delete()
      .eq("profile_id", profileId)
      .eq("vehicle_id", vehicleId);

    if (error) {
      return { status: StatusCode.BAD_REQUEST, error };
    }

    return { status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    return handleServerError(error, "removing favourite (server)");
  }
};

export const getUserFavourites = async (profileId: string) => {
  if (!profileId)
    return {
      data: [],
      status: StatusCode.UNAUTHORIZED,
      error: "Missing profile ID",
    };

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("vehicle_favourites")
      .select("vehicle_id")
      .eq("profile_id", profileId);

    if (error) {
      return { data: [], status: StatusCode.BAD_REQUEST, error };
    }

    return {
      data: data?.map((favourite) => favourite.vehicle_id) ?? [],
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    return handleServerError(error, "getting user favourites (server)");
  }
};

export const getMyProfileViewCount = async (
  userId: string,
  timeframe: "7d" | "30d" | "90d" | "365d" | "all" = "30d"
) => {
  try {
    const supabase = await createClient();

    const dateFilter = (() => {
      const daysMap = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "365d": 365,
      };
      if (timeframe === "all") return null;
      const date = new Date();
      date.setDate(date.getDate() - daysMap[timeframe]);
      return date.toISOString();
    })();

    let query = supabase
      .from("profile_views")
      .select("id", { count: "exact", head: true })
      .eq("profile_owner_id", userId);

    if (dateFilter) {
      query = query.gte("viewed_at", dateFilter);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Error getting page views (server):", error);
      return { data: 0, status: StatusCode.BAD_REQUEST, error };
    }

    return { data: count ?? 0, status: StatusCode.SUCCESS, error: null };
  } catch (error) {
    console.error("Error getting page views (server):", error);
    return { data: 0, status: StatusCode.INTERNAL_SERVER_ERROR, error };
  }
};

export const getAdClicksByVehicleWithInfo = async (
  userId: string,
  timeframe: "7d" | "30d" | "90d" | "365d" | "all" = "7d"
) => {
  try {
    const supabase = await createClient();

    const dateFilter = (() => {
      const daysMap = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "365d": 365,
      };
      if (timeframe === "all") return null;
      const date = new Date();
      date.setDate(date.getDate() - daysMap[timeframe]);
      return date.toISOString();
    })();

    let query = supabase
      .from("vehicle_ad_clicks")
      .select(
        `
      vehicle_id,
      clicked_at,
      vehicles (
        make,
        model,
        year
      )
    `
      )
      .eq("vehicle_owner_id", userId);

    if (dateFilter) {
      query = query.gte("clicked_at", dateFilter);
    }

    const { data, error } = await query;

    if (error) return { data: [], status: StatusCode.BAD_REQUEST, error };

    // Count clicks per vehicle
    const clickMap: Record<
      string,
      { make: string; model: string; year: number | null; clickCount: number }
    > = {};

    for (const row of data ?? []) {
      const id = row.vehicle_id;
      if (!clickMap[id]) {
        clickMap[id] = {
          make: row.vehicles?.make ?? "Unknown",
          model: row.vehicles?.model ?? "Unknown",
          year: row.vehicles?.year ?? null,
          clickCount: 0,
        };
      }
      clickMap[id].clickCount += 1;
    }

    return {
      data: Object.entries(clickMap).map(([vehicleId, info]) => ({
        vehicleId,
        ...info,
      })),
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    console.error("Error getting ad clicks (server):", error);
    return { data: [], status: StatusCode.INTERNAL_SERVER_ERROR, error };
  }
};
