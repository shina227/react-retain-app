import { SearchLg } from '@untitledui/icons';
import { Input } from '@/components/ui/input';

// The search box in an admin list's header.
export function ListSearch({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div role="search" className="relative w-full sm:w-64">
      <SearchLg
        aria-hidden
        className="pointer-events-none absolute top-2 left-3 size-5 text-fg-quaternary"
      />
      <Input
        type="search"
        aria-label={label}
        placeholder="Search"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 pl-10 text-sm"
      />
    </div>
  );
}
