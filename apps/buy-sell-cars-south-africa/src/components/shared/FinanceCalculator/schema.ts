import { object, number, union, literal } from "zod";

export const financeCalculatorSchema = object({
  vehiclePrice: number()
    .min(1, "Vehicle price must be greater than 0")
    .max(10000000, "Vehicle price seems unrealistically high"),
  deposit: number().min(0, "Deposit cannot be negative").default(0),
  tradeIn: number().min(0, "Trade-in value cannot be negative").default(0),
  interestRate: number()
    .min(0, "Interest rate cannot be negative")
    .max(50, "Interest rate seems unrealistically high")
    .default(12.75),
  residual: number()
    .min(0, "Residual cannot be negative")
    .max(100, "Residual cannot exceed 100%")
    .default(0),
  repaymentMonths: union([
    literal(12),
    literal(24),
    literal(36),
    literal(48),
    literal(60),
    literal(72),
    literal(84),
    literal(96),
  ]).default(72),
});
