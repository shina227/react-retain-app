import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { AlertTriangle, CheckCircle, InfoCircle, Loading02, XCircle } from '@untitledui/icons';
import { cn } from '@/lib/utils';

// Untitled "outline" featured icon: the icon in its status colour inside two fading rings.
function RingedIcon({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'relative grid size-5 place-items-center rounded-full',
        'before:absolute before:-inset-1.5 before:rounded-full before:border-2 before:border-current before:opacity-30',
        'after:absolute after:-inset-3 after:rounded-full after:border-2 after:border-current after:opacity-10',
        className,
      )}
    >
      {children}
    </span>
  );
}

// Untitled notification: ringed status icon, bold title with supporting text underneath,
// and a close button. Sonner's own CSS isn't in a layer, hence the `!` overrides.
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      closeButton
      icons={{
        success: (
          <RingedIcon className="text-success-600">
            <CheckCircle className="size-5" />
          </RingedIcon>
        ),
        info: (
          <RingedIcon className="text-brand-600">
            <InfoCircle className="size-5" />
          </RingedIcon>
        ),
        warning: (
          <RingedIcon className="text-warning-600">
            <AlertTriangle className="size-5" />
          </RingedIcon>
        ),
        error: (
          <RingedIcon className="text-error-600">
            <XCircle className="size-5" />
          </RingedIcon>
        ),
        loading: <Loading02 className="size-5 animate-spin text-fg-quaternary" />,
      }}
      style={
        {
          '--normal-bg': 'var(--background-color-primary)',
          '--normal-text': 'var(--text-color-primary)',
          '--normal-border': 'var(--border-color-primary)',
          '--border-radius': 'var(--radius-xl)',
          '--width': '400px',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast items-start! gap-4! p-4! pr-12! shadow-lg!',
          icon: 'm-0! mt-0.5! ml-1! size-5! shrink-0',
          content: 'gap-1!',
          title: 'text-sm! font-semibold! text-primary!',
          description: 'text-sm! text-tertiary!',
          closeButton:
            'top-3! right-3! left-auto! size-8! transform-none! rounded-md! border-0! bg-transparent! text-fg-quaternary! hover:bg-primary_hover! hover:text-fg-quaternary_hover! [&>svg]:size-4!',
          actionButton:
            'h-auto! bg-transparent! p-0! text-sm! font-semibold! text-brand-secondary! hover:text-brand-secondary_hover!',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
