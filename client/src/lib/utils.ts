export { cn } from 'cn';

// "Ama Kofi Mensah" → "AK"
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
