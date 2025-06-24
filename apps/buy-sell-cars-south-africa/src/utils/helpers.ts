export const formatPriceToRands = (price: number): string => {
  // Create a formatter for South African Rand currency using en-ZA locale
  const formatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  });

  // Use formatToParts to split the formatted string into parts
  const parts = formatter.formatToParts(price);

  // Reconstruct the string with a space between the currency symbol and the number
  return parts
    .map((part) => (part.type === "currency" ? part.value + " " : part.value))
    .join("");
};

/**
 * Validates a South African phone number.
 * The phone number must start with +27 and be followed by 9 digits.
 *
 * @param phoneNumber - The phone number to validate.
 * @returns A boolean indicating whether the phone number is valid.
 */
export const isValidSouthAfricaPhoneNumber = (phoneNumber: string): boolean => {
  // Regular expression to match South African phone numbers in the format +27XXXXXXXXX
  const southAfricaPhoneRegex = /^\+27\d{9}$/;

  // Test the phone number against the regex
  return southAfricaPhoneRegex.test(phoneNumber);
};

/**
 * Formats a phone number to ensure it includes South Africa's country code (27)
 * and is suitable for WhatsApp links (no spaces, dashes, or parentheses).
 *
 * @param phone The input phone number as a string.
 * @returns The formatted phone number string.
 */
export function formatPhoneNumberToSaCountryCode(
  phone: string | undefined | null
): string {
  if (!phone) return "";

  // Remove all non-digit characters from the input
  const digits = phone.replace(/\D/g, "");

  // If the number starts with '27', it's already in the correct format
  if (digits.startsWith("27")) {
    return digits;
  }

  // If the number starts with '0', replace it with '27'
  if (digits.startsWith("0")) {
    return "27" + digits.slice(1);
  }

  // If the number starts with anything else, prepend '27'
  return "27" + digits;
}
