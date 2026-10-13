import type { FC, SVGProps } from 'react';

// Any icon from @untitledui/icons (they all take plain SVG props), for props like `icon={...}`.
export type IconComponent = FC<SVGProps<SVGSVGElement>>;
