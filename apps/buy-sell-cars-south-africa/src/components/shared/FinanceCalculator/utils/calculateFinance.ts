import { FormValues } from "../types";

export const calculateFinance = (data: Partial<FormValues>) => {
  // Provide defaults for potentially undefined values
  const {
    vehiclePrice = 0,
    deposit = 0,
    tradeIn = 0,
    interestRate = 0,
    residual = 0,
    repaymentMonths = 72,
  } = data;

  if (vehiclePrice <= 0 || repaymentMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      loanValue: 0,
    };
  }

  const principal = vehiclePrice - deposit - tradeIn;
  const residualValue = (residual / 100) * vehiclePrice;
  const loanAmount = principal - residualValue;
  const monthlyInterestRate = interestRate / 12 / 100;

  if (loanAmount <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      loanValue: loanAmount,
    };
  }

  const monthlyPayment =
    monthlyInterestRate === 0
      ? loanAmount / repaymentMonths
      : (loanAmount *
          (monthlyInterestRate *
            Math.pow(1 + monthlyInterestRate, repaymentMonths))) /
        (Math.pow(1 + monthlyInterestRate, repaymentMonths) - 1);

  // Round the monthly payment first to ensure consistent calculations
  const roundedMonthlyPayment = Math.round(monthlyPayment);
  const totalPayment = roundedMonthlyPayment * repaymentMonths + residualValue;
  const totalInterest = roundedMonthlyPayment * repaymentMonths - loanAmount;

  return {
    monthlyPayment: roundedMonthlyPayment,
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    loanValue: Math.round(loanAmount),
  };
};
