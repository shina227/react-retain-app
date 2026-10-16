import { Monitor01, Moon01, Sun } from '@untitledui/icons';
import { useTheme } from 'next-themes';
import { Panel } from '@/components/Panel';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon01 },
  { value: 'system', label: 'System', icon: Monitor01 },
];

// A native radio group styled as cards, so arrow keys and screen readers work as expected.
// next-themes saves the choice and applies it before the first paint on the next visit.
export function AppearanceSettings() {
  const { theme = 'system', setTheme } = useTheme();

  return (
    <Panel title="Appearance" description="Pick a theme, or follow your device's setting.">
      <fieldset className="p-4 md:p-6">
        <legend className="sr-only">Theme</legend>
        <div className="grid max-w-lg grid-cols-3 gap-3">
          {themes.map(({ value, label, icon: Icon }) => (
            <label
              key={value}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-secondary bg-primary p-4 text-sm font-semibold text-secondary transition hover:bg-primary_hover has-checked:border-brand has-checked:text-brand-secondary has-focus-visible:ring-4 has-focus-visible:ring-brand-500/24"
            >
              <input
                type="radio"
                name="theme"
                value={value}
                checked={theme === value}
                onChange={() => setTheme(value)}
                className="sr-only"
              />
              <Icon aria-hidden className="size-5" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>
    </Panel>
  );
}
