import { Profile } from "@/src/types";

/**
 * Filters dealers by excluding those with subscription types in the excludedTypes array,
 * then sorts the remaining dealers alphabetically by dealership_name (case-insensitive).
 * @param dealers - Array of dealer profiles
 * @param subscriptionTypes - Array of subscription types
 * @returns Filtered and alphabetically sorted array of dealers
 */
export const filterAndSortByDealers = (
  dealers: Profile[],
  subscriptionTypes: string[],
  isFeatured: boolean = false
): Profile[] => {
  return dealers
    .filter((dealer) =>
      isFeatured
        ? subscriptionTypes.includes(dealer.subscription || "")
        : !subscriptionTypes.includes(dealer.subscription || "")
    )
    .sort((a, b) => {
      const nameA = (a.dealership_name || "").toLowerCase();
      const nameB = (b.dealership_name || "").toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
};

export const sortByDealershipName = (dealers: Profile[]): Profile[] => {
  return dealers.sort((a, b) => {
    const nameA = (a.dealership_name || "").toLowerCase();
    const nameB = (b.dealership_name || "").toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
};
