"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { StatusCode, getPageName } from "~bsc-shared/utils";
import { logProfileView } from "@/src/server/actions/analytics";

type ViewerTrackerProps = {
  profileOwnerId: string;
  viewerId?: string;
};

export const ViewerTracker = ({
  profileOwnerId,
  viewerId,
}: ViewerTrackerProps) => {
  // Ref to keep track of the last logged profileId
  const lastLoggedProfileId = useRef<string | null>(null);

  const pathname = usePathname();

  const pageName = getPageName(pathname);

  useEffect(() => {
    const handleLogProfileView = async (
      pageName: string,
      profileOwnerId: string,
      viewerId?: string
    ) => {
      if (!profileOwnerId) return;

      const logProfileViewData = {
        sourcePage: pageName,
        profileOwnerId,
        viewerId,
      };

      if (lastLoggedProfileId.current !== profileOwnerId) {
        const { status, error } = await logProfileView(logProfileViewData);

        if (status !== StatusCode.SUCCESS || error) {
          console.error("Failed to log profile view:", error);
          return;
        }

        lastLoggedProfileId.current = profileOwnerId; // Update ref to prevent duplicate logs
      }
    };

    handleLogProfileView(pageName, profileOwnerId, viewerId);
  }, [pageName, profileOwnerId, viewerId]);

  return null;
};
