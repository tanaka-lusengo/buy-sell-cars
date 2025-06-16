import { format } from "date-fns";

// Utility function to format price into pounds
export const formatPriceToDollars = (price: number): string => {
  const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "USD",
  });

  // Use formatToParts to split the formatted string into parts
  const parts = formatter.formatToParts(price);

  // Reconstruct the string with a space between the currency symbol and the number
  return parts
    .map((part) => (part.type === "currency" ? part.value + " " : part.value))
    .join("");
};

// Utility function to format mileage with commas
export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("en-US").format(mileage);
};

/**
 * Validates a Zimbabwean phone number.
 * The phone number must start with +263 and be followed by 9 digits.
 *
 * @param phoneNumber - The phone number to validate.
 * @returns A boolean indicating whether the phone number is valid.
 */
export const isValidZimbabwePhoneNumber = (phoneNumber: string): boolean => {
  // Regular expression to match Zimbabwean phone numbers
  const zimbabwePhoneRegex = /^\+263\d{9}$/;

  // Test the phone number against the regex
  return zimbabwePhoneRegex.test(phoneNumber);
};

/**
 * Capitalizes the first character of a string.
 * @param str - The string to capitalize.
 * @returns The string with the first character capitalized.
 */
export const capitaliseFirstChar = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a string to snake_case format.
 * Example: 'Car rental' -> 'car_rental'
 *
 * @param input - The string to be converted.
 * @returns The snake_case version of the input string.
 */
export const toSnakeCase = (input: string): string => {
  // Convert the string to lowercase and replace spaces with underscores
  return input.toLowerCase().replace(/\s+/g, "_");
};

// Fisher-Yates Shuffle
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return format(date, "dd/MM/yyyy");
};

export const formatToReadableString = (
  value: string | number | boolean
): string => capitaliseFirstChar(String(value).replace(/_/g, " "));

/**
 * Formats a phone number to ensure it includes Zimbabwe's country code (+263)
 * and is suitable for WhatsApp links (no spaces, dashes, or parentheses).
 *
 * @param phone The input phone number as a string.
 * @returns The formatted phone number string.
 */
export function formatPhoneNumberToZimCountryCode(
  phone: string | undefined | null
): string {
  if (!phone) return "";

  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // If the number starts with '263', it's already in the correct format
  if (digits.startsWith("263")) {
    return digits;
  }

  // If the number starts with '0', replace it with '263'
  if (digits.startsWith("0")) {
    return "263" + digits.slice(1);
  }

  // If the number starts with anything else, prepend '263'
  return "263" + digits;
}

/**
 * Returns "homepage" if the pathname is "/", otherwise returns the original pathname.
 *
 * @param pathname - The current pathname string.
 * @returns "homepage" if pathname is "/", else the original pathname.
 */
export const getPageName = (pathname: string): string => {
  // If the pathname is just "/", return "homepage"
  if (pathname === "/") {
    return "homepage";
  }

  return pathname;
};

export const getStartDate = (range: string) => {
  const now = new Date();
  switch (range) {
    case "day":
      now.setDate(now.getDate() - 1);
      break;
    case "month":
      now.setMonth(now.getMonth() - 1);
      break;
    case "quarter":
      now.setMonth(now.getMonth() - 3);
      break;
    case "year":
      now.setFullYear(now.getFullYear() - 1);
      break;
  }
  return now.toISOString();
};
