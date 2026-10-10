import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { TextField, type TextFieldProps } from './TextField';

// TextField with a show/hide toggle (the eye icon in the Untitled design).
export function PasswordField({ className, ...props }: Omit<TextFieldProps, 'type' | 'trailing'>) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      className={cn('pr-10', className)}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="rounded-sm text-fg-quaternary transition hover:text-fg-quaternary_hover focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Icon aria-hidden className="size-4" />
        </button>
      }
    />
  );
}
