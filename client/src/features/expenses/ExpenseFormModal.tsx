import { zodResolver } from '@hookform/resolvers/zod';
import { useId, useState, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { FormAlert } from '@/components/form/FormAlert';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { fromMinor, todayISO } from '@/lib/format';
import { applyServerErrors } from '@/lib/forms';
import type { Expense, ExpenseInput, PaymentMethod } from '@/types/api';
import { paymentMethodLabels } from './constants';
import { ExpenseLoadError } from './ExpenseLoadError';
import { ExpenseModal } from './ExpenseModal';
import {
  useCreateExpenseMutation,
  useGetCategoriesQuery,
  useGetExpenseQuery,
  useUpdateExpenseMutation,
} from './expensesApi';
import { useCloseOverlay } from './overlayNavigation';
import { expenseFormSchema, type ExpenseFormValues } from './schemas';

const NOTES_MAX = 500;

// /expenses/new: a modal over the list.
export function NewExpensePanel() {
  const [createExpense] = useCreateExpenseMutation();
  const close = useCloseOverlay();

  return (
    <ExpenseForm
      title="Add expense"
      description="Record something you've spent."
      submitLabel="Add expense"
      // Mobile money is the most common way to pay in Rwanda, so it's the default.
      defaultValues={{
        title: '',
        amount: '',
        categoryId: '',
        date: todayISO(),
        paymentMethod: 'MOBILE_MONEY',
        notes: '',
      }}
      onSave={async (input) => {
        await createExpense(input).unwrap();
        toast.success('Expense added');
        close();
      }}
    />
  );
}

// /expenses/:id/edit: the same modal. Saving returns to wherever the user came from (normally the detail view).
export function EditExpensePanel() {
  const { id = '' } = useParams();
  const { data: expense, error, isLoading, refetch } = useGetExpenseQuery(id);
  const [updateExpense] = useUpdateExpenseMutation();
  const close = useCloseOverlay();

  if (isLoading) {
    return (
      <ExpenseModal title="Edit expense">
        <FormSkeleton />
      </ExpenseModal>
    );
  }
  if (!expense) return <ExpenseLoadError error={error} onRetry={refetch} shell={ExpenseModal} />;

  return (
    <ExpenseForm
      key={expense.id}
      title="Edit expense"
      description={expense.title}
      submitLabel="Save changes"
      defaultValues={toFormValues(expense)}
      onSave={async (input) => {
        await updateExpense({ id: expense.id, body: input }).unwrap();
        toast.success('Changes saved');
        close();
      }}
    />
  );
}

const toFormValues = (expense: Expense): ExpenseFormValues => ({
  title: expense.title,
  amount: fromMinor(expense.amount),
  categoryId: expense.categoryId,
  date: expense.date,
  paymentMethod: expense.paymentMethod,
  notes: expense.notes ?? '',
});

// The form shared by create and edit. Field errors show inline; anything the server rejects
// that isn't tied to a field (e.g. a category deleted meanwhile) shows as an alert on top.
function ExpenseForm({
  title,
  description,
  submitLabel,
  defaultValues,
  onSave,
}: {
  title: string;
  description: string;
  submitLabel: string;
  defaultValues: ExpenseFormValues;
  onSave: (input: ExpenseInput) => Promise<void>;
}) {
  const formId = useId();
  const close = useCloseOverlay();
  const [formError, setFormError] = useState<string | null>(null);
  const categories = useGetCategoriesQuery();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ExpenseFormValues, unknown, ExpenseInput>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (input) => {
    setFormError(null);
    try {
      await onSave(input);
    } catch (error) {
      setFormError(applyServerErrors(error, setError));
    }
  });

  const notesLength = useWatch({ control, name: 'notes' })?.length ?? 0;
  const categoryPlaceholder = categories.isLoading
    ? 'Loading categories…'
    : categories.isError
      ? "Couldn't load categories"
      : 'Choose a category';

  return (
    <ExpenseModal
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <SubmitButton form={formId} pending={isSubmitting}>
            {submitLabel}
          </SubmitButton>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        {formError && <FormAlert>{formError}</FormAlert>}

        <TextField
          id="expense-title"
          label="Title"
          placeholder="Weekly groceries"
          maxLength={100}
          error={errors.title?.message}
          {...register('title')}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="expense-amount"
            label="Amount"
            leading="RF"
            inputMode="numeric"
            placeholder="0"
            autoComplete="off"
            error={errors.amount?.message}
            {...register('amount')}
          />
          <TextField
            id="expense-date"
            label="Date"
            type="date"
            error={errors.date?.message}
            {...register('date')}
          />
        </div>

        <Controller
          control={control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <SelectField id="expense-category" label="Category" error={fieldState.error?.message}>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={!categories.data}
              >
                <SelectTrigger
                  ref={field.ref}
                  id="expense-category"
                  aria-invalid={!!fieldState.error}
                  onBlur={field.onBlur}
                  className="w-full"
                >
                  <SelectValue placeholder={categoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {categories.data?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span
                        aria-hidden
                        className="size-2 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectField>
          )}
        />

        <Controller
          control={control}
          name="paymentMethod"
          render={({ field, fieldState }) => (
            <SelectField
              id="expense-payment"
              label="Payment method"
              error={fieldState.error?.message}
            >
              <Select
                value={field.value}
                onValueChange={(value) => field.onChange(value as PaymentMethod)}
              >
                <SelectTrigger
                  ref={field.ref}
                  id="expense-payment"
                  aria-invalid={!!fieldState.error}
                  onBlur={field.onBlur}
                  className="w-full"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(paymentMethodLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectField>
          )}
        />

        <Field data-invalid={!!errors.notes}>
          <div className="flex items-baseline justify-between">
            <FieldLabel htmlFor="expense-notes">
              Notes <span className="font-normal text-tertiary">(optional)</span>
            </FieldLabel>
            <span aria-hidden className="text-xs text-tertiary tabular-nums">
              {notesLength}/{NOTES_MAX}
            </span>
          </div>
          <Textarea
            id="expense-notes"
            placeholder="Anything worth remembering about this expense"
            maxLength={NOTES_MAX}
            aria-invalid={!!errors.notes}
            aria-describedby="expense-notes-message"
            {...register('notes')}
          />
          {errors.notes ? (
            <FieldError id="expense-notes-message">{errors.notes.message}</FieldError>
          ) : (
            <FieldDescription id="expense-notes-message">
              Up to {NOTES_MAX} characters.
            </FieldDescription>
          )}
        </Field>
      </form>
    </ExpenseModal>
  );
}

// Label + control + error for the Radix selects, which can't take register() directly.
function SelectField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      {children}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

function FormSkeleton() {
  return (
    <div aria-busy aria-label="Loading expense" className="flex flex-col gap-5">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      ))}
    </div>
  );
}
