import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { isApiError } from '@/lib/api';

// Server error codes that are about one field, even though they come without field details.
const fieldForCode: Record<string, string> = {
  EMAIL_TAKEN: 'email',
  CATEGORY_EXISTS: 'name',
  INVALID_CATEGORY: 'categoryId',
};

// Puts server validation messages on their fields and focuses the first one. Returns a
// form-level message when the error isn't about specific fields (e.g. wrong password).
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): string | null {
  if (!isApiError(error)) return 'Something went wrong. Try again.';

  const codeField = fieldForCode[error.code];
  if (codeField) {
    setError(
      codeField as Path<T>,
      { type: 'server', message: error.message },
      { shouldFocus: true },
    );
    return null;
  }

  const fields = Object.entries(error.details ?? {});
  fields.forEach(([field, messages], i) => {
    const message = messages[0] ?? error.message;
    setError(field as Path<T>, { type: 'server', message }, { shouldFocus: i === 0 });
  });
  return fields.length > 0 ? null : error.message;
}

// For date inputs whose browser icon is replaced by ours: clicking anywhere opens the picker.
// showPicker() throws in some embeds (cross-origin iframes); typing the date still works there.
export function openDatePicker(input: HTMLInputElement) {
  try {
    input.showPicker();
  } catch {
    // No picker available here.
  }
}
