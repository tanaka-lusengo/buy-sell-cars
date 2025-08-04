"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InputField } from "~bsc-shared/components/FormComponents";
import { H1, P, Button } from "~bsc-shared/ui";
import {
  handleClientError,
  StatusCode,
  toastNotifySuccess,
} from "~bsc-shared/utils";
import { signInValidationSchema, signInFormDefaultValues } from "@/src/schemas";
import { signIn } from "@/src/server/actions/auth";
import { type SignInFormType } from "@/src/types";
import { HStack, Divider, Flex } from "@/styled-system/jsx";
import { Form } from "./index.styled";

export const SignInForm = () => {
  const { push, refresh } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInValidationSchema),
    mode: "all",
    defaultValues: signInFormDefaultValues,
  });

  const handleAction = async (formData: SignInFormType) => {
    try {
      const { status, error } = await signIn(formData);

      if (status === StatusCode.BAD_REQUEST) {
        return handleClientError("signing in", error);
      }

      toastNotifySuccess("Sign in Success! ");

      refresh();
      push("/dashboard");
    } catch (error) {
      handleClientError("signing up", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: SignInFormType) => await handleAction(formValues)
      )}
    >
      <HStack marginBottom="md">
        <H1>Sign in</H1>
      </HStack>

      <InputField
        label="Email address"
        name="email"
        type="email"
        placeholder="example@gmail.com"
        register={register}
        errors={errors}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        register={register}
        errors={errors}
      />

      <Flex
        direction={{ base: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap="sm"
      >
        <Button type="submit">Sign in</Button>
        <Link href="/">
          <P hoverEffect="color">Forgot password?</P>
        </Link>
      </Flex>

      <Divider marginY="md" color="grey" />

      <P color="primaryDark" weight="bold">
        <i>Don&apos;t have an account?</i>
      </P>

      <HStack justifyContent="space-between">
        <Link href="/sign-up">
          <P hoverEffect="color">Sign up</P>
        </Link>

        <Link href="/">
          <P hoverEffect="color">Close</P>
        </Link>
      </HStack>
    </Form>
  );
};
