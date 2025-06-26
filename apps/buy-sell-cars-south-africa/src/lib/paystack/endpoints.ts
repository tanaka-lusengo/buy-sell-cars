import { StatusCode, logErrorMessage } from "~bsc-shared/utils";
import type {
  PaystackVerificationResponse,
  PaystackSubscriptionResponse,
  PaystackManageSubscriptionResponse,
} from "./types";

const PAYSTACK_SECRET_KEY =
  process.env.NODE_ENV === "production"
    ? process.env.PAYSTACK_SECRET_KEY_LIVE
    : process.env.PAYSTACK_SECRET_KEY_TEST;

/**
 * Verifies a Paystack subscription transaction using the provided reference.
 *
 * @param {string} reference - The unique reference ID for the Paystack transaction.
 * @returns The verification result. Returns an error object if verification fails or the reference is missing.
 */
export const verifySubscription = async (reference: string) => {
  if (!reference) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Reference ID is required for verification",
    };
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await res.json();

  if (!res.ok || result.data.status !== "success") {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Verification failed",
    };
  }

  return {
    data: result.data as PaystackVerificationResponse["data"],
    status: StatusCode.SUCCESS,
    error: null,
  };
};

/**
 * Fetches a Paystack subscription for a given customer and plan code.
 *
 * @param {string} customerCode - The Paystack customer code to search for.
 * @param {string} planCode - The Paystack plan code to search for.
 * @returns An object containing the subscription data (if found), status code, and error message (if any).
 *
 * This function paginates through Paystack subscriptions and filters by customer and plan code.
 * Returns the first matching subscription or null if not found.
 */
export const getPaystackSubscription = async (
  customerCode: string,
  planCode: string
) => {
  if (!customerCode || !planCode) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Customer plan and plan code are required",
    };
  }

  let page = 1;
  const perPage = 50;
  const MAX_PAGES = 20;
  let matchingSubscriptions: PaystackSubscriptionResponse["data"] = [];

  try {
    while (true) {
      const url = `https://api.paystack.co/subscription?page=${page}&perPage=${perPage}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();

      if (!res.ok || !result.status) {
        return {
          data: null,
          status: StatusCode.BAD_REQUEST,
          error: `Failed to fetch subscriptions: ${result.message || res.statusText}`,
        };
      }

      const subs: PaystackSubscriptionResponse["data"] = result.data;

      const filtered = subs.filter(
        (sub) =>
          sub.customer.customer_code === customerCode &&
          sub.plan.plan_code === planCode
      );

      matchingSubscriptions = matchingSubscriptions.concat(filtered);

      const meta = result.meta || {};
      const total = meta.total || 0;
      const currentPage = meta.page || 1;
      const per_page = meta.per_page || perPage;

      const totalPages = total > 0 ? Math.ceil(total / per_page) : 1;

      if (currentPage >= totalPages || page >= MAX_PAGES) {
        break;
      }

      page++;
    }

    return {
      data: matchingSubscriptions.length > 0 ? matchingSubscriptions[0] : null,
      status: StatusCode.SUCCESS,
      error: null,
    };
  } catch (error) {
    logErrorMessage(error, "fetching paystack subscription (server)");
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Unknown error occurred",
    };
  }
};

/**
 * Generates a management link for a Paystack subscription.
 *
 * @param {string} subscriptionCode - The Paystack subscription code to manage.
 * @returns An object containing the management link data, status code, and error message (if any).
 *
 * This function fetches a management link for the given subscription code from Paystack.
 */
export const manageSubscription = async (subscriptionCode: string) => {
  if (!subscriptionCode) {
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Plan code is required for managing subscription",
    };
  }

  const res = await fetch(
    `https://api.paystack.co/subscription/${subscriptionCode}/manage/link`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const result = await res.json();

  if (!res.ok) {
    logErrorMessage(result, "managing subscription (server)");
    return {
      data: null,
      status: StatusCode.BAD_REQUEST,
      error: "Failed to manage subscription",
    };
  }

  return {
    data: result.data as PaystackManageSubscriptionResponse["data"],
    status: StatusCode.SUCCESS,
    error: null,
  };
};
