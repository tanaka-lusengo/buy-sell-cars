'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Typography, Button } from '@/src/components/ui';
import { HStack, Divider } from '@/styled-system/jsx';
import { InputField } from '@/src/components/FormComponents';
import { signInValidationSchema, signInFormDefaultValues } from '@/src/schemas';
import { signIn } from '@/src/server/actions/auth';
import { type SignInFormType } from '@/src/types';
import { handleClientError, StatusCode, toastNotifySuccess } from '@/src/utils';
import { Form } from './index.styled';

export const SignInForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormType>({
    resolver: zodResolver(signInValidationSchema),
    mode: 'all',
    defaultValues: signInFormDefaultValues,
  });

  const handleAction = async (formData: SignInFormType) => {
    try {
      const { status, error } = await signIn(formData);

      if (status === StatusCode.BAD_REQUEST) {
        return handleClientError('signing in', error);
      }

      toastNotifySuccess('Sign in Success! ');
      router.push('/dashboard');
    } catch (error) {
      handleClientError('signing up', error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit(
        async (formValues: SignInFormType) => await handleAction(formValues)
      )}
    >
      <HStack marginBottom="md">
        <Typography variant="h1">Sign in</Typography>
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

      <HStack justifyContent="space-between" alignItems="flex-start">
        <Button type="submit">Sign in</Button>
        <Link href="/">
          <Typography hoverEffect="color">Forgot password?</Typography>
        </Link>
      </HStack>

      <Divider marginY="lg" color="grey" />

      <Typography color="primaryDark" weight="bold">
        <i>Don&apos;t have an account?</i>
      </Typography>

      <HStack justifyContent="space-between">
        <Link href="/sign-up">
          <Typography hoverEffect="color">Sign up</Typography>
        </Link>

        <Link href="/">
          <Typography hoverEffect="color">Close</Typography>
        </Link>
      </HStack>
    </Form>
  );
};
