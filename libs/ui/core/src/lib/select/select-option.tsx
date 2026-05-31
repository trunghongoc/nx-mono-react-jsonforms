import type { ReactNode } from 'react';

export interface SelectOptionProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

/** Marker component — rendered by Select, not directly. */
export function SelectOption(_props: SelectOptionProps) {
  return null;
}

export default SelectOption;
