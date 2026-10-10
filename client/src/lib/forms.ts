import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isApiError } from '@/lib/api';

// Puts server validation messages on their fields. Returns a form-level message
// when the error isn't about specific fields (e.g. wrong password, email taken).
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  if (!isApiError(error)) return 'Something went wrong. Try again.';

  const fields = Object.entries(error.details ?? {});
  for (const [field, messages] of fields) {
    setError(field as Path<T>, { type: 'server', message: messages[0] ?? error.message });
  }
  return fields.length > 0 ? null : error.message;
}
