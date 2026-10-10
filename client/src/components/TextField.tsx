import type { ComponentProps, ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export type TextFieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  trailing?: ReactNode; // e.g. an icon button inside the input, on the right
};

// Label + input + error (or hint). Spread react-hook-form's register() straight onto it.
export function TextField({ id, label, error, hint, trailing, ...inputProps }: TextFieldProps) {
  const messageId = `${id}-message`;
  const input = (
    <Input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error || hint ? messageId : undefined}
      {...inputProps}
    />
  );

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {trailing ? (
        <div className="relative">
          {input}
          <div className="absolute inset-y-0 right-3.5 flex items-center">{trailing}</div>
        </div>
      ) : (
        input
      )}
      {error ? (
        <FieldError id={messageId}>{error}</FieldError>
      ) : (
        hint && <FieldDescription id={messageId}>{hint}</FieldDescription>
      )}
    </Field>
  );
}
