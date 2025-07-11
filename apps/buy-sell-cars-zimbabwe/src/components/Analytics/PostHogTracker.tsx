"use client";

import { useEffect } from "react";
import {
  trackVehicleView,
  type TrackVehicleViewEvent,
  trackDealerView,
  type TrackDealerViewEvent,
} from "./utils";

export const PostHogVehicleViewTracker = ({
  vehicleData,
}: {
  vehicleData: TrackVehicleViewEvent;
}) => {
  useEffect(() => {
    trackVehicleView(vehicleData);
  }, [vehicleData]);

  return null;
};

export const PostHogDealerViewTracker = ({
  dealerData,
}: {
  dealerData: TrackDealerViewEvent;
}) => {
  useEffect(() => {
    trackDealerView(dealerData);
  }, [dealerData]);

  return null;
};
