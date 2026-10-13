import type { ComponentProps, ReactNode } from 'react';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type TextFieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  leading?: string; // fixed text inside the input, on the left (e.g. a currency)
  trailing?: ReactNode; // e.g. an icon button inside the input, on the right
};

// Label + input + error (or hint). Spread react-hook-form's register() straight onto it.
export function TextField({
  id,
  label,
  error,
  hint,
  leading,
  trailing,
  className,
  ...inputProps
}: TextFieldProps) {
  const messageId = `${id}-message`;
  const input = (
    <Input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error || hint ? messageId : undefined}
      className={cn(leading && 'pl-12', className)}
      {...inputProps}
    />
  );

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {leading || trailing ? (
        <div className="relative">
          {leading && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-base text-tertiary"
            >
              {leading}
            </span>
          )}
          {input}
          {trailing && (
            <div className="absolute inset-y-0 right-3.5 flex items-center">{trailing}</div>
          )}
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
