import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { AlertTriangle, CheckCircle, InfoCircle, Loading02, XCircle } from '@untitledui/icons';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CheckCircle className="size-4" />,
        info: <InfoCircle className="size-4" />,
        warning: <AlertTriangle className="size-4" />,
        error: <XCircle className="size-4" />,
        loading: <Loading02 className="size-4 animate-spin" />,
      }}
      style={
        {
          '--normal-bg': 'var(--background-color-primary)',
          '--normal-text': 'var(--text-color-primary)',
          '--normal-border': 'var(--border-color-secondary)',
          '--border-radius': 'var(--radius-xl)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
