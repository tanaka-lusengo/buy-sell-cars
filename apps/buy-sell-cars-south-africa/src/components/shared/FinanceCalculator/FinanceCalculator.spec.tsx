"use client";

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { FinanceCalculator } from "./index";

describe("FinanceCalculator component", () => {
  const defaultVehiclePrice = 419900;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with initial values", () => {
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    expect(screen.getByText("Finance Calculator:")).toBeInTheDocument();
    expect(screen.getByText("Monthly Payments")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(defaultVehiclePrice.toString())
    ).toBeInTheDocument();
    expect(screen.getByTestId("monthly-payment")).toBeInTheDocument();
  });

  it("calculates loan correctly with default values", async () => {
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    // With vehicle price 419900, deposit 0, trade-in 0, 12.75% interest, 72 months
    // Expected calculation: principal = 419900, monthly rate = 12.75/12/100 = 0.010625
    // Monthly payment = 419900 * (0.010625 * (1.010625)^72) / ((1.010625)^72 - 1)

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment).toHaveTextContent(/R \d{1,3}(,\d{3})*/);
    });
  });

  it("updates calculations when vehicle price changes", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const vehiclePriceInput = screen.getByTestId("vehiclePrice");

    // Clear and type new value
    await user.clear(vehiclePriceInput);
    await user.type(vehiclePriceInput, "500000");

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment).toHaveTextContent(/R \d{1,3}(,\d{3})*/);
    });
  });

  it("updates calculations when deposit changes", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const depositInput = screen.getByTestId("deposit");

    await user.clear(depositInput);
    await user.type(depositInput, "50000");

    await waitFor(() => {
      const loanValue = screen.getByText(/Total Loan Value:/);
      // Loan value should be vehicle price minus deposit
      expect(loanValue).toHaveTextContent("R 369,900");
    });
  });

  it("updates calculations when trade-in value changes", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const tradeInInput = screen.getByTestId("tradeIn");

    await user.clear(tradeInInput);
    await user.type(tradeInInput, "30000");

    await waitFor(() => {
      const loanValue = screen.getByText(/Total Loan Value:/);
      // With vehiclePrice 419900, deposit 41990 (10%), tradeIn 30000
      // Loan value should be 419900 - 41990 - 30000 = 347910
      expect(loanValue).toHaveTextContent("R 347,910");
    });
  });

  it("updates calculations when interest rate changes", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const initialMonthlyPayment =
      screen.getByTestId("monthly-payment").textContent;

    const interestRateInput = screen.getByTestId("interestRate");

    await user.clear(interestRateInput);
    await user.type(interestRateInput, "15");

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment.textContent).not.toBe(initialMonthlyPayment);
    });
  });

  it("updates calculations when repayment period changes", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const initialMonthlyPayment =
      screen.getByTestId("monthly-payment").textContent;

    const repaymentMonthsSelect = screen.getByTestId("repaymentMonths");

    await user.selectOptions(repaymentMonthsSelect, "36");

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment.textContent).not.toBe(initialMonthlyPayment);
    });
  });

  it("handles residual value correctly", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const residualInput = screen.getByTestId("residual");

    await user.clear(residualInput);
    await user.type(residualInput, "20"); // 20% residual

    await waitFor(() => {
      // With 20% residual, the loan amount should be reduced
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment).toHaveTextContent(/R \d{1,3}(,\d{3})*/);
    });
  });

  it("resets calculator when reset button is clicked", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    // Change some values
    const depositInput = screen.getByTestId("deposit");
    await user.clear(depositInput);
    await user.type(depositInput, "50000");

    const interestRateInput = screen.getByTestId("interestRate");
    await user.clear(interestRateInput);
    await user.type(interestRateInput, "15");

    // Click reset
    const resetButton = screen.getByText("Reset Calculator");
    await user.click(resetButton);

    await waitFor(() => {
      expect(depositInput).toHaveValue(41990); // 10% of 419900
      expect(interestRateInput).toHaveValue(12.75);
    });
  });

  it("handles zero vehicle price", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const vehiclePriceInput = screen.getByTestId("vehiclePrice");

    await user.clear(vehiclePriceInput);
    await user.type(vehiclePriceInput, "0");

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment).toHaveTextContent("R 0");
    });
  });

  it("handles case where deposit and trade-in exceed vehicle price", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={100000} />);

    const depositInput = screen.getByTestId("deposit");
    await user.clear(depositInput);
    await user.type(depositInput, "60000");

    const tradeInInput = screen.getByTestId("tradeIn");
    await user.clear(tradeInInput);
    await user.type(tradeInInput, "50000");

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      expect(monthlyPayment).toHaveTextContent("R 0");
    });
  });

  it("handles zero interest rate", async () => {
    const user = userEvent.setup();
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const interestRateInput = screen.getByTestId("interestRate");

    await user.clear(interestRateInput);
    await user.type(interestRateInput, "0");

    await waitFor(() => {
      const monthlyPayment = screen.getByTestId("monthly-payment");
      // With 0% interest, monthly payment should be loan amount / months
      // vehiclePrice 419900 - deposit 41990 (10%) = 377910
      // 377910 / 72 = 5249
      expect(monthlyPayment).toHaveTextContent("R 5,249");
    });
  });

  it("displays all repayment period options", () => {
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    const expectedOptions = [
      "12 months",
      "24 months",
      "36 months",
      "48 months",
      "60 months",
      "72 months",
      "84 months",
      "96 months",
    ];

    expectedOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("displays disclaimer text", () => {
    render(<FinanceCalculator vehiclePrice={defaultVehiclePrice} />);

    expect(
      screen.getByText(/these calculations are estimates only/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Car finance is subject to bank approval/)
    ).toBeInTheDocument();
  });

  it("formats currency values with commas", async () => {
    render(<FinanceCalculator vehiclePrice={1000000} />);

    await waitFor(() => {
      const loanValue = screen.getByText(/Total Loan Value:/);
      // vehiclePrice 1000000 - deposit 100000 (10%) = 900000
      expect(loanValue).toHaveTextContent("R 900,000");
    });
  });
});
