import { describe, it, expect } from "vitest";
import { calculateFinance } from "./calculateFinance";

describe("calculateFinance function", () => {
  //   const calculateFinance = (data: {
  //     vehiclePrice?: number;
  //     deposit?: number;
  //     tradeIn?: number;
  //     interestRate?: number;
  //     residual?: number;
  //     repaymentMonths?: number;
  //   }) => {
  //     const {
  //       vehiclePrice = 0,
  //       deposit = 0,
  //       tradeIn = 0,
  //       interestRate = 0,
  //       residual = 0,
  //       repaymentMonths = 72,
  //     } = data;

  //     if (vehiclePrice <= 0 || repaymentMonths <= 0) {
  //       return {
  //         monthlyPayment: 0,
  //         totalPayment: 0,
  //         totalInterest: 0,
  //         loanValue: 0,
  //       };
  //     }

  //     const principal = vehiclePrice - deposit - tradeIn;
  //     const residualValue = (residual / 100) * vehiclePrice;
  //     const loanAmount = principal - residualValue;
  //     const monthlyInterestRate = interestRate / 12 / 100;

  //     if (loanAmount <= 0) {
  //       return {
  //         monthlyPayment: 0,
  //         totalPayment: 0,
  //         totalInterest: 0,
  //         loanValue: loanAmount,
  //       };
  //     }

  //     const monthlyPayment =
  //       monthlyInterestRate === 0
  //         ? loanAmount / repaymentMonths
  //         : (loanAmount *
  //             (monthlyInterestRate *
  //               Math.pow(1 + monthlyInterestRate, repaymentMonths))) /
  //           (Math.pow(1 + monthlyInterestRate, repaymentMonths) - 1);

  //     // Round the monthly payment first to ensure consistent calculations
  //     const roundedMonthlyPayment = Math.round(monthlyPayment);
  //     const totalPayment =
  //       roundedMonthlyPayment * repaymentMonths + residualValue;
  //     const totalInterest = roundedMonthlyPayment * repaymentMonths - loanAmount;

  //     return {
  //       monthlyPayment: roundedMonthlyPayment,
  //       totalPayment: Math.round(totalPayment),
  //       totalInterest: Math.round(totalInterest),
  //       loanValue: Math.round(loanAmount),
  //     };
  //   };

  it("calculates correctly with standard values", () => {
    const result = calculateFinance({
      vehiclePrice: 419900,
      deposit: 0,
      tradeIn: 0,
      interestRate: 12.75,
      residual: 0,
      repaymentMonths: 72,
    });

    expect(result.loanValue).toBe(419900);
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalPayment).toBeGreaterThan(result.loanValue);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it("calculates correctly with deposit", () => {
    const result = calculateFinance({
      vehiclePrice: 419900,
      deposit: 50000,
      tradeIn: 0,
      interestRate: 12.75,
      residual: 0,
      repaymentMonths: 72,
    });

    expect(result.loanValue).toBe(369900);
  });

  it("calculates correctly with trade-in", () => {
    const result = calculateFinance({
      vehiclePrice: 419900,
      deposit: 0,
      tradeIn: 30000,
      interestRate: 12.75,
      residual: 0,
      repaymentMonths: 72,
    });

    expect(result.loanValue).toBe(389900);
  });

  it("calculates correctly with residual value", () => {
    const result = calculateFinance({
      vehiclePrice: 100000,
      deposit: 0,
      tradeIn: 0,
      interestRate: 10,
      residual: 20, // 20%
      repaymentMonths: 60,
    });

    expect(result.loanValue).toBe(80000); // 100000 - 20000 residual
  });

  it("handles zero interest rate", () => {
    const result = calculateFinance({
      vehiclePrice: 72000,
      deposit: 0,
      tradeIn: 0,
      interestRate: 0,
      residual: 0,
      repaymentMonths: 72,
    });

    expect(result.monthlyPayment).toBe(1000); // 72000 / 72
    expect(result.totalInterest).toBe(0);
  });

  it("returns zero values for invalid inputs", () => {
    const result = calculateFinance({
      vehiclePrice: 0,
      deposit: 0,
      tradeIn: 0,
      interestRate: 10,
      residual: 0,
      repaymentMonths: 72,
    });

    expect(result.monthlyPayment).toBe(0);
    expect(result.totalPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.loanValue).toBe(0);
  });

  it("handles case where deposit + trade-in exceeds vehicle price", () => {
    const result = calculateFinance({
      vehiclePrice: 100000,
      deposit: 60000,
      tradeIn: 50000,
      interestRate: 10,
      residual: 0,
      repaymentMonths: 72,
    });

    expect(result.monthlyPayment).toBe(0);
    expect(result.loanValue).toBe(-10000);
  });

  it("ensures monthly payments add up correctly to total payment", () => {
    // Test case based on user's example: Total Loan Value of 38,999
    const result = calculateFinance({
      vehiclePrice: 38999,
      deposit: 0,
      tradeIn: 0,
      interestRate: 12.75,
      residual: 0,
      repaymentMonths: 12,
    });

    expect(result.loanValue).toBe(38999);

    // Verify that monthly payments * months equals the total payment minus residual
    const calculatedTotal = result.monthlyPayment * 12;
    const expectedTotal = result.totalPayment; // Since no residual value

    expect(calculatedTotal).toBe(expectedTotal);

    // Also verify the total interest calculation is consistent
    const calculatedInterest = calculatedTotal - result.loanValue;
    expect(calculatedInterest).toBe(result.totalInterest);
  });

  it("ensures consistency with residual value included", () => {
    const result = calculateFinance({
      vehiclePrice: 100000,
      deposit: 0,
      tradeIn: 0,
      interestRate: 10,
      residual: 20, // 20% residual = 20,000
      repaymentMonths: 24,
    });

    const residualValue = 20000;
    const loanAmount = 80000; // 100000 - 20000 residual

    expect(result.loanValue).toBe(loanAmount);

    // Monthly payments should cover the loan amount + interest
    const paymentsTotal = result.monthlyPayment * 24;
    const totalPaymentWithoutResidual = result.totalPayment - residualValue;

    expect(paymentsTotal).toBe(totalPaymentWithoutResidual);

    // Total interest should be payments total minus loan amount
    expect(result.totalInterest).toBe(paymentsTotal - loanAmount);
  });
});
