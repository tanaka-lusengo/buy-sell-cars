"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { InputField, SelectField, Divider } from "~bsc-shared";
import { Typography, Button } from "~bsc-shared/ui";
import { formatPriceToRands } from "@/src/utils";
import { Grid, Flex, Container, Box, HStack } from "@/styled-system/jsx";
import { REPAYMENT_MONTHS_OPTIONS } from "./constants";
import { FormValues } from "./types";
import { calculateFinance } from "./utils/calculateFinance";

export const FinanceCalculator = ({
  vehiclePrice,
}: {
  vehiclePrice: number;
}) => {
  const defaultValues: FormValues = useMemo(
    () => ({
      vehiclePrice,
      deposit: vehiclePrice * 0.1, // Default 10% deposit
      tradeIn: 0,
      interestRate: 12.75,
      residual: 0,
      repaymentMonths: 72,
    }),
    [vehiclePrice]
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const [results, setResults] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    loanValue: 0,
  });

  // Memoized formatted values to avoid unnecessary re-computations
  const formattedMonthlyPayment = useMemo(
    () => formatPriceToRands(results.monthlyPayment),
    [results.monthlyPayment]
  );

  const formattedLoanValue = useMemo(
    () => formatPriceToRands(results.loanValue),
    [results.loanValue]
  );

  const formattedTotalInterest = useMemo(
    () => formatPriceToRands(results.totalInterest),
    [results.totalInterest]
  );

  const formattedTotalPayment = useMemo(
    () => formatPriceToRands(results.totalPayment),
    [results.totalPayment]
  );

  // Calculate initial values on mount
  useEffect(() => {
    const initialResults = calculateFinance(defaultValues);
    setResults(initialResults);
  }, [defaultValues]);

  // Watch for form changes and recalculate
  useEffect(() => {
    const subscription = watch((values) => {
      const calculatedResults = calculateFinance(values);
      setResults(calculatedResults);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const handleReset = () => {
    reset(defaultValues);
  };

  return (
    <Container
      marginY="lg"
      width="100%"
      height="100%"
      maxWidth={{ base: "29rem", sm: "55rem", md: "65rem" }}
      onSubmit={handleSubmit(() => {})}
    >
      <Typography variant="h4" weight="bold">
        Finance Calculator:
      </Typography>

      <Grid
        marginTop="sm"
        columns={{ base: 1, lg: 2 }}
        gap="lg"
        alignItems="stretch"
      >
        {/* Left Column - Inputs */}
        <Flex direction="column" gap="sm" flex="1">
          <Flex
            direction="column"
            gap="md"
            backgroundColor="white"
            borderRadius="1rem"
            padding="md"
          >
            <InputField
              name="vehiclePrice"
              label="Vehicle Price:"
              type="number"
              register={register}
              errors={errors}
              decimalNumbers
              flex
              data-testid="vehiclePrice"
            />

            <InputField
              name="deposit"
              label="Less Deposit:"
              type="number"
              register={register}
              errors={errors}
              decimalNumbers
              flex
              data-testid="deposit"
            />

            <InputField
              name="tradeIn"
              label="Less Trade-in Value:"
              type="number"
              register={register}
              errors={errors}
              decimalNumbers
              flex
              data-testid="tradeIn"
            />
          </Flex>

          <Box paddingX="sm" marginY="sm">
            <Typography variant="h4">
              Total Loan Value:{" "}
              <Typography
                as="span"
                weight="bold"
                color="primaryDark"
                style={{ fontSize: "inherit" }}
              >
                {formattedLoanValue}
              </Typography>
            </Typography>
          </Box>

          <Flex
            direction="column"
            gap="md"
            backgroundColor="white"
            borderRadius="1rem"
            padding="md"
          >
            <InputField
              name="interestRate"
              label="Interest Rate (%):"
              type="number"
              register={register}
              errors={errors}
              decimalNumbers
              flex
              data-testid="interestRate"
            />

            <InputField
              name="residual"
              label="Residual (%):"
              type="number"
              register={register}
              errors={errors}
              decimalNumbers
              flex
              data-testid="residual"
            />

            <SelectField
              name="repaymentMonths"
              label="Repayment Period:"
              register={register}
              errors={errors}
              flex
              data-testid="repaymentMonths"
            >
              {REPAYMENT_MONTHS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </Flex>
        </Flex>

        {/* Right Column - Results */}
        <Flex
          direction="column"
          gap="sm"
          backgroundColor="white"
          borderRadius="1rem"
          padding="md"
          flex="1"
        >
          <Typography weight="bold">Monthly Payments</Typography>

          <Typography
            variant="h3"
            weight="bold"
            color="primaryDark"
            data-testid="monthly-payment"
          >
            {formattedMonthlyPayment}
          </Typography>

          <Divider color="greyDark" marginY="sm" />

          <HStack justifyContent="space-between">
            <Typography>Total Interest</Typography>
            <Typography variant="h4">{formattedTotalInterest}</Typography>
          </HStack>

          <HStack justifyContent="space-between">
            <Typography>Total Payment</Typography>
            <Typography variant="h4">{formattedTotalPayment}</Typography>
          </HStack>

          <Divider color="greyDark" marginY="sm" />

          <Typography variant="body2">
            <i>
              * Please note that{" "}
              <strong>these calculations are estimates only</strong> and should
              be confirmed with your finance provider. They do not include
              license and registration fees, finance provider fees, or any other
              associated administrative fees. Car finance is subject to bank
              approval with an accredited finance provider.
            </i>
          </Typography>

          <Button type="button" onClick={handleReset} variant="ghost" size="md">
            Reset Calculator
          </Button>
        </Flex>
      </Grid>
    </Container>
  );
};
