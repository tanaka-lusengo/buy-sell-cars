import type { MetadataRoute } from "next";

// This sitemap includes all main navigation links as per navLinksMap.
// Each entry has a lastModified date, changeFrequency, and priority set appropriately.

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Home page
    {
      url: "https://buysellcars.co.zw",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Cars for sale section
    {
      url: "https://buysellcars.co.zw/car/sales",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Car rentals section
    {
      url: "https://buysellcars.co.zw/car/rentals",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Dealers page
    {
      url: "https://buysellcars.co.zw/dealers",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // Trucks for sale section
    {
      url: "https://buysellcars.co.zw/truck/sales",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Truck rentals section
    {
      url: "https://buysellcars.co.zw/truck/rentals",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Bikes for sale section
    {
      url: "https://buysellcars.co.zw/bike/sales",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Bike rentals section
    {
      url: "https://buysellcars.co.zw/bike/rentals",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Agriculture machinery sales section
    {
      url: "https://buysellcars.co.zw/agriculture/sales",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Agriculture rentals section
    {
      url: "https://buysellcars.co.zw/agriculture/rentals",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Earth-moving machinery sales section
    {
      url: "https://buysellcars.co.zw/earth-moving/sales",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    // Earth-moving rentals section
    {
      url: "https://buysellcars.co.zw/earth-moving/rentals",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
