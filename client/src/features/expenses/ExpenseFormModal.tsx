import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, CreditCardEdit, CreditCardPlus } from '@untitledui/icons';
import { useId, useState, type ReactNode } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { FormAlert } from '@/components/form/FormAlert';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { formatMoney, fromMinor, todayISO } from '@/lib/format';
import { applyServerErrors, openDatePicker } from '@/lib/forms';
import type { Expense, ExpenseInput, PaymentMethod } from '@/types/api';
import type { IconComponent } from '@/types/icon';
import { paymentMethodIcons, paymentMethodLabels } from './constants';
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

const paymentMethods = Object.keys(paymentMethodLabels) as PaymentMethod[];

// /expenses/new: a modal over the list.
export function NewExpensePanel() {
  const [createExpense] = useCreateExpenseMutation();
  const close = useCloseOverlay();

  return (
    <ExpenseForm
      title="Add expense"
      description="Record something you've spent."
      icon={CreditCardPlus}
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
        toast.success('Expense added', {
          description: `${input.title} · ${formatMoney(input.amount)}`,
        });
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
      <ExpenseModal title="Edit expense" icon={CreditCardEdit}>
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
      icon={CreditCardEdit}
      submitLabel="Save changes"
      defaultValues={toFormValues(expense)}
      onSave={async (input) => {
        await updateExpense({ id: expense.id, body: input }).unwrap();
        toast.success('Changes saved', { description: input.title });
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
  icon,
  submitLabel,
  defaultValues,
  onSave,
}: {
  title: string;
  description: string;
  icon: IconComponent;
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
    // Inline validation: a field is checked when you leave it, then live as you fix it.
    mode: 'onTouched',
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
      icon={icon}
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

        {/* The amount is what the expense is about, so it leads, large. */}
        <TextField
          id="expense-amount"
          label="Amount"
          leading="RF"
          inputMode="numeric"
          placeholder="0"
          autoComplete="off"
          className="h-14 pl-13 text-display-xs font-semibold tabular-nums"
          error={errors.amount?.message}
          {...register('amount')}
        />

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
            id="expense-date"
            label="Date"
            type="date"
            icon={Calendar}
            // Our calendar icon replaces the browser's, so clicking anywhere opens the picker.
            className="[&::-webkit-calendar-picker-indicator]:hidden"
            onClick={(event) => openDatePicker(event.currentTarget)}
            error={errors.date?.message}
            {...register('date')}
          />

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
        </div>

        <FieldSet className="gap-0" data-invalid={!!errors.paymentMethod}>
          <FieldLegend variant="label" className="text-secondary">
            Payment method
          </FieldLegend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {paymentMethods.map((method) => {
              const Icon = paymentMethodIcons[method];
              return (
                <label
                  key={method}
                  className="flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-secondary bg-primary p-3 shadow-xs transition hover:border-primary has-checked:border-brand has-checked:bg-utility-brand-50 has-checked:ring-1 has-checked:ring-(--border-color-brand) has-focus-visible:ring-4 has-focus-visible:ring-brand-500/24"
                >
                  <input
                    type="radio"
                    value={method}
                    className="peer sr-only"
                    {...register('paymentMethod')}
                  />
                  <span className="grid size-8 place-items-center rounded-lg border border-secondary bg-primary text-fg-quaternary shadow-xs peer-checked:border-transparent peer-checked:bg-brand-600 peer-checked:text-white">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-secondary peer-checked:text-utility-brand-700">
                    {paymentMethodLabels[method]}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.paymentMethod && (
            <FieldError className="mt-1.5">{errors.paymentMethod.message}</FieldError>
          )}
        </FieldSet>

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

// Same shape as the form: big amount, title, date + category, payment cards, notes.
function FormSkeleton() {
  const field = (input: string) => (
    <div className="flex flex-col gap-1.5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className={input} />
    </div>
  );

  return (
    <div aria-busy aria-label="Loading expense" className="flex flex-col gap-5">
      {field('h-14 w-full rounded-lg')}
      {field('h-11 w-full rounded-lg')}
      <div className="grid gap-5 sm:grid-cols-2">
        {field('h-11 w-full rounded-lg')}
        {field('h-11 w-full rounded-lg')}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-23 rounded-xl" />
        ))}
      </div>
      {field('h-28 w-full rounded-lg')}
    </div>
  );
}
