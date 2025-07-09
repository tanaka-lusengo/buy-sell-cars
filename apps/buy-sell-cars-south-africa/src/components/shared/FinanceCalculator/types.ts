import { z } from "zod";
import { financeCalculatorSchema } from "./schema";

export type FinanceCalculatorFormValues = z.infer<
  typeof financeCalculatorSchema
>;

export type FormValues = {
  vehiclePrice: number;
  deposit: number;
  tradeIn: number;
  interestRate: number;
  residual: number;
  repaymentMonths: 12 | 24 | 36 | 48 | 60 | 72 | 84 | 96;
};

export interface FinanceCalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  loanValue: number;
}
