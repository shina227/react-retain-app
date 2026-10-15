import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Plus, Tag01 } from '@untitledui/icons';
import { useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FeaturedIcon, FeaturedIconRings } from '@/components/feedback/FeaturedIcon';
import { FormAlert } from '@/components/form/FormAlert';
import { SubmitButton } from '@/components/form/SubmitButton';
import { TextField } from '@/components/form/TextField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { isApiError } from '@/lib/api';
import { applyServerErrors } from '@/lib/forms';
import { cn } from '@/lib/utils';
import type { AdminCategory } from '@/types/api';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from './adminApi';

// Mirrors the server's rules (validators/category.ts).
const categorySchema = z.object({
  name: z.string().trim().min(1, 'Enter a name').max(50, 'Keep it under 50 characters'),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, 'Pick a colour'),
});
type CategoryFormValues = z.infer<typeof categorySchema>;

const PRESETS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#14b8a6',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#a855f7',
  '#ec4899',
  '#f43f5e',
  '#94a3b8',
];

// Create a category (category = null) or edit one. The form only mounts while open.
export function CategoryDialog({
  category,
  open,
  onOpenChange,
}: {
  category: AdminCategory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="relative gap-1 px-4 pt-5 pr-14 pb-5 sm:px-6 sm:pt-6">
          <FeaturedIconRings className="-top-31 -left-32 sm:-top-30 sm:-left-30" />
          <FeaturedIcon icon={Tag01} className="relative mb-3" />
          <DialogTitle className="relative">
            {category ? 'Edit category' : 'New category'}
          </DialogTitle>
          <DialogDescription className="relative">
            Categories are shared by every user.
          </DialogDescription>
        </DialogHeader>
        <CategoryForm category={category} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CategoryForm({
  category,
  onDone,
}: {
  category: AdminCategory | null;
  onDone: () => void;
}) {
  const formId = useId();
  const [formError, setFormError] = useState<string | null>(null);
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    mode: 'onTouched',
    defaultValues: { name: category?.name ?? '', color: category?.color ?? PRESETS[7] },
  });

  const onSubmit = handleSubmit(async (input) => {
    setFormError(null);
    try {
      if (category) await updateCategory({ id: category.id, ...input }).unwrap();
      else await createCategory(input).unwrap();
      toast.success(category ? 'Category updated' : 'Category created', {
        description: input.name,
      });
      onDone();
    } catch (error) {
      // A duplicate name comes back as a form-level 409; it belongs on the name field.
      if (isApiError(error) && error.code === 'CATEGORY_EXISTS') {
        setError('name', { type: 'server', message: error.message });
      } else {
        setFormError(applyServerErrors(error, setError));
      }
    }
  });

  return (
    <>
      <form
        id={formId}
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-5 px-4 pb-6 sm:px-6"
      >
        {formError && <FormAlert>{formError}</FormAlert>}
        <TextField
          id="category-name"
          label="Name"
          placeholder="e.g. Transport"
          autoComplete="off"
          autoFocus
          error={errors.name?.message}
          {...register('name')}
        />
        <Controller
          control={control}
          name="color"
          render={({ field }) => <ColorPicker value={field.value} onChange={field.onChange} />}
        />
      </form>
      <DialogFooter className="grid grid-cols-2 gap-3 border-t border-secondary px-4 pt-4 pb-4 sm:px-6 sm:pb-6 [&>*]:w-full">
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <SubmitButton form={formId} pending={isSubmitting}>
          {category ? 'Save changes' : 'Create category'}
        </SubmitButton>
      </DialogFooter>
    </>
  );
}

const swatch =
  'relative grid size-8 place-items-center rounded-full text-white outline-none transition focus-visible:ring-4 focus-visible:ring-brand-500/24 aria-checked:ring-2 aria-checked:ring-(--border-color-brand) aria-checked:ring-offset-2 aria-checked:ring-offset-(--background-color-primary)';

// Preset swatches plus a custom one that opens the browser's colour picker.
function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const isCustom = !PRESETS.includes(value.toLowerCase());

  return (
    <div className="flex flex-col gap-1.5">
      <span id="category-color" className="text-sm font-medium text-secondary">
        Colour
      </span>
      <div role="radiogroup" aria-labelledby="category-color" className="flex flex-wrap gap-2.5">
        {PRESETS.map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={value.toLowerCase() === color}
            aria-label={color}
            onClick={() => onChange(color)}
            className={swatch}
            style={{ backgroundColor: color }}
          >
            {value.toLowerCase() === color && <Check aria-hidden className="size-4" />}
          </button>
        ))}
        <label
          role="radio"
          aria-checked={isCustom}
          aria-label="Custom colour"
          className={cn(
            swatch,
            'cursor-pointer',
            !isCustom && 'border border-dashed border-primary text-fg-quaternary',
          )}
          style={isCustom ? { backgroundColor: value } : undefined}
        >
          {isCustom ? (
            <Check aria-hidden className="size-4" />
          ) : (
            <Plus aria-hidden className="size-4" />
          )}
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  );
}
