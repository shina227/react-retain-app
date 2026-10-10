import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = {
  sm: { tile: 'size-6 rounded-md', icon: 'size-3.5' }, // sidebar and mobile header
  md: { tile: 'size-8 rounded-lg', icon: 'size-4.5' }, // auth pages
};

// Untitled-style logomark: white tile with a faint grid and soft depth, indigo wallet icon.
export function Logomark({ size = 'md' }: { size?: keyof typeof sizes }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid shrink-0 place-items-center overflow-hidden bg-white shadow-sm ring-[0.5px] ring-black/12',
        sizes[size].tile,
      )}
    >
      <span className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.06)_1px,transparent_1px)] bg-size-[25%_25%]" />
      <span className="absolute inset-0 bg-linear-to-b from-white/20 to-black/10" />
      <Wallet className={cn('relative text-brand-600', sizes[size].icon)} strokeWidth={2.25} />
    </span>
  );
}

// Logomark + wordmark, as in the Untitled sidebar header.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <Logomark size="sm" />
      <span className="text-lg leading-6 font-semibold text-primary">Retain</span>
    </span>
  );
}
