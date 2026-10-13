import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormAlert } from '@/components/form/FormAlert';
import { PasswordField } from '@/components/form/PasswordField';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { useAuth } from '@/features/auth/AuthContext';
import { AuthHeader } from '@/features/auth/AuthHeader';
import { loginSchema } from '@/features/auth/schemas';
import { applyServerErrors } from '@/lib/forms';

// On success the auth state changes and GuestRoute redirects to the intended page.
export default function LoginPage() {
  const { login } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await login(values);
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <>
      <AuthHeader
        title="Log in to your account"
        description="Welcome back! Please enter your details."
      />
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
        <div className="flex flex-col gap-5">
          {formError && <FormAlert>{formError}</FormAlert>}
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
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>
        <SubmitButton pending={isSubmitting} size="lg" className="w-full">
          Log in
        </SubmitButton>
      </form>
    </>
  );
}
