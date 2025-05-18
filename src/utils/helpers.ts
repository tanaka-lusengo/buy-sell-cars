// Utility function to format price into pounds
export const formatPriceToDollars = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Utility function to format mileage with commas
export const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat('en-US').format(mileage);
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
