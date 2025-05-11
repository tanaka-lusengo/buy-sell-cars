/**
 * Converts a string to snake_case format.
 * Example: 'Car rental' -> 'car_rental'
 *
 * @param input - The string to be converted.
 * @returns The snake_case version of the input string.
 */
export const toSnakeCase = (input: string): string => {
  // Convert the string to lowercase and replace spaces with underscores
  return input.toLowerCase().replace(/\s+/g, '_');
};
