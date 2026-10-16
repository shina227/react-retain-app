import { zodResolver } from '@hookform/resolvers/zod';
import { Mail01 } from '@untitledui/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { FormAlert } from '@/components/form/FormAlert';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { Panel } from '@/components/Panel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { profileSchema } from '@/features/auth/schemas';
import { applyServerErrors } from '@/lib/forms';
import type { User } from '@/types/api';

type ProfileValues = z.infer<typeof profileSchema>;

// Name and email. Save stays disabled until something changes; Cancel puts the saved values back.
export function ProfileForm({ user }: { user: User }) {
  const { updateProfile } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    defaultValues: { name: user.name, email: user.email },
  });

  const onSubmit = handleSubmit(async (input) => {
    setFormError(null);
    try {
      await updateProfile(input);
      reset(input); // the new values become the baseline, so Save disables again
      toast.success('Profile updated');
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  return (
    <Panel title="Profile" description="Your name and the email you sign in with.">
      <form onSubmit={onSubmit} noValidate>
        <div className="flex max-w-lg flex-col gap-5 p-4 md:p-6">
          {formError && <FormAlert>{formError}</FormAlert>}
          <TextField
            id="profile-name"
            label="Name"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextField
            id="profile-email"
            label="Email"
            type="email"
            icon={Mail01}
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>
        <div className="flex justify-end gap-3 border-t border-secondary px-4 py-4 md:px-6">
          <Button
            type="button"
            variant="secondary"
            disabled={!isDirty || isSubmitting}
            onClick={() => {
              reset();
              setFormError(null);
            }}
          >
            Cancel
          </Button>
          <SubmitButton pending={isSubmitting} disabled={!isDirty || isSubmitting}>
            Save changes
          </SubmitButton>
        </div>
      </form>
    </Panel>
  );
}
