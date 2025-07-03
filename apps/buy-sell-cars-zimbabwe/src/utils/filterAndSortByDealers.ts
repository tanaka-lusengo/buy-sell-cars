import { Profile, ProfileWithSubscription } from "@/src/types";

/**
 * Filters dealers by excluding those with subscription types in the excludedTypes array,
 * then sorts the remaining dealers alphabetically by dealership_name (case-insensitive).
 * @param dealers - Array of dealer profiles
 * @param subscriptionTypes - Array of subscription types
 * @returns Filtered and alphabetically sorted array of dealers
 */
export const filterAndSortByDealers = (
  dealers: ProfileWithSubscription[],
  subscriptionTypes: string[],
  isFeatured: boolean = false
): ProfileWithSubscription[] => {
  return dealers
    .filter((dealer) => {
      const subscriptionName = dealer.subscriptions?.subscription_name || "";
      return isFeatured
        ? subscriptionTypes.includes(subscriptionName)
        : !subscriptionTypes.includes(subscriptionName);
    })
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
