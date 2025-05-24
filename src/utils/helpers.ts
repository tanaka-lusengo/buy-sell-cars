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
