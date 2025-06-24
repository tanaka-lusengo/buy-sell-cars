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
