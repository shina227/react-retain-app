import { Wallet02 } from '@untitledui/icons';
import { cn } from '@/lib/utils';

const sizes = {
  sm: { tile: 'size-6 rounded-md', icon: 'size-3.5' }, // sidebar and mobile header
  md: { tile: 'size-8 rounded-lg', icon: 'size-4.5' }, // auth pages
};

// Untitled-style logomark: indigo tile with a faint grid and soft depth, white wallet icon.
export function Logomark({ size = 'md' }: { size?: keyof typeof sizes }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden bg-brand-600 shadow-sm ring-[0.5px] ring-black/12 ring-inset',
        sizes[size].tile,
      )}
    >
      <span className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.1)_1px,transparent_1px)] bg-size-[25%_25%]" />
      <span className="absolute inset-0 bg-linear-to-b from-white/20 to-black/10" />
      <Wallet02 className={cn('relative text-white', sizes[size].icon)} strokeWidth={2.25} />
    </span>
  );
}

const wordmarks = {
  sm: 'text-lg leading-6',
  md: 'text-xl leading-7.5',
};

// Logomark + wordmark, as in the Untitled sidebar header.
export function Logo({
  size = 'sm',
  className,
}: {
  size?: keyof typeof sizes;
  className?: string;
}) {
  return (
    <span className={cn('flex items-center gap-2', size === 'md' && 'gap-2.5', className)}>
      <Logomark size={size} />
      <span className={cn('font-semibold text-primary', wordmarks[size])}>Retain</span>
    </span>
  );
}
