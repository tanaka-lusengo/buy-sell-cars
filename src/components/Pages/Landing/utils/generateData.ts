/**
 * Generates an array of years from 1950 to the current year.
 * @returns {number[]} An array of years.
 */
export const generateYears = (): number[] => {
  const years: number[] = [];

  const currentYear = new Date().getFullYear();
  const startYear = 1950;

  // Loop from the start year to the current year and populate the array
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }

  return years;
};

/**
 * Generates an array of prices in dollars from $0 to $2,000,000 in increments of $500.
 * @returns {string[]} An array of prices.
 */
export const generatePrices = (): string[] => {
  const prices: string[] = [];

  // Helper function to generate price ranges
  const addPriceRange = (start: number, end: number, increment: number) => {
    for (let price = start; price <= end; price += increment) {
      prices.push(`$${price.toLocaleString()}`);
    }
  };

  // Define price ranges and increments
  addPriceRange(0, 10000, 500);
  addPriceRange(10000, 20000, 1000);
  addPriceRange(20000, 30000, 2500);
  addPriceRange(30000, 75000, 50000);

  // Add fixed prices
  const fixedPrices = [100000, 200000, 250000, 500000, 1000000, 2000000];
  fixedPrices.forEach((price) => prices.push(`$${price.toLocaleString()}`));

  // Remove duplicates from the prices array
  return Array.from(new Set(prices));
};
