import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { FormAlert } from '@/components/form/FormAlert';
import { PasswordField } from '@/components/form/PasswordField';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { useAuth } from '@/features/auth/AuthContext';
import { AuthHeader } from '@/features/auth/AuthHeader';
import { PasswordRequirement } from '@/features/auth/PasswordRequirement';
import { registerSchema } from '@/features/auth/schemas';
import { applyServerErrors } from '@/lib/forms';

export default function RegisterPage() {
  const { register: registerAccount } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const password = useWatch({ control, name: 'password' });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await registerAccount(values);
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <>
      <AuthHeader title="Create an account" description="Start tracking where your money goes." />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          {formError && <FormAlert>{formError}</FormAlert>}
          <TextField
            id="name"
            label="Name"
            autoComplete="name"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />
          <PasswordField
            id="password"
            label="Password"
            autoComplete="new-password"
            placeholder="Create a password"
            error={errors.password?.message}
            {...register('password')}
          />
          <ul aria-label="Password requirements" className="flex flex-col gap-3">
            <PasswordRequirement met={password.length >= 8}>
              Must be at least 8 characters
            </PasswordRequirement>
          </ul>
        </div>
        <SubmitButton pending={isSubmitting} size="lg" className="w-full">
          Get started
        </SubmitButton>
      </form>
    </>
  );
}
