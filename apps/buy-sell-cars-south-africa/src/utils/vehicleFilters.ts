import { VehicleWithImageAndDealer } from "@/src/types";

export type FilterCriteria = {
  vehicleCategory?: string;
  location?: string;
  make?: string;
  model?: string;
  year?: string;
  condition?: string;
  fuelType?: string;
  gearboxType?: string;
  minPrice?: string;
  maxPrice?: string;
};

export const filterVehicles = (
  vehicles: VehicleWithImageAndDealer[],
  criteria: FilterCriteria
): VehicleWithImageAndDealer[] => {
  return vehicles.filter((vehicle) => {
    // Vehicle category filter
    if (criteria.vehicleCategory) {
      if (vehicle.vehicle_category !== criteria.vehicleCategory) {
        return false;
      }
    }

    // Location filter
    if (criteria.location && criteria.location.trim() !== "") {
      if (
        !vehicle.location
          ?.toLowerCase()
          .includes(criteria.location.toLowerCase())
      ) {
        return false;
      }
    }

    // Make filter (case-insensitive partial match)
    if (criteria.make && criteria.make.trim() !== "") {
      if (!vehicle.make?.toLowerCase().includes(criteria.make.toLowerCase())) {
        return false;
      }
    }

    // Model filter (case-insensitive partial match)
    if (criteria.model && criteria.model.trim() !== "") {
      if (
        !vehicle.model?.toLowerCase().includes(criteria.model.toLowerCase())
      ) {
        return false;
      }
    }

    // Year filter
    if (criteria.year && criteria.year.trim() !== "") {
      if (vehicle.year?.toString() !== criteria.year) {
        return false;
      }
    }

    // Condition filter
    if (criteria.condition && criteria.condition.trim() !== "") {
      if (vehicle.condition !== criteria.condition) {
        return false;
      }
    }

    // Fuel type filter
    if (criteria.fuelType && criteria.fuelType.trim() !== "") {
      if (vehicle.fuel !== criteria.fuelType) {
        return false;
      }
    }

    // Gearbox type filter
    if (criteria.gearboxType && criteria.gearboxType.trim() !== "") {
      if (vehicle.gear_box !== criteria.gearboxType) {
        return false;
      }
    }

    // Price range filter
    const vehiclePrice = vehicle.price || 0;

    if (criteria.minPrice && criteria.minPrice.trim() !== "") {
      const minPrice = parseInt(criteria.minPrice.replace(/\D/g, ""), 10);
      if (vehiclePrice < minPrice) {
        return false;
      }
    }

    if (criteria.maxPrice && criteria.maxPrice.trim() !== "") {
      const maxPrice = parseInt(criteria.maxPrice.replace(/\D/g, ""), 10);
      if (vehiclePrice > maxPrice) {
        return false;
      }
    }

    return true;
  });
};

export const parseUrlSearchParams = (
  searchParams: URLSearchParams
): FilterCriteria => {
  return {
    vehicleCategory: searchParams.get("vehicleCategory") || undefined,
    location: searchParams.get("location") || undefined,
    make: searchParams.get("make") || undefined,
    model: searchParams.get("model") || undefined,
    year: searchParams.get("year") || undefined,
    condition: searchParams.get("condition") || undefined,
    fuelType: searchParams.get("fuelType") || undefined,
    gearboxType: searchParams.get("gearboxType") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
  };
};
