import { createContext, useContext, type ReactNode, type Ref } from 'react';

export interface DropdownMenuContextValue {
  useCustomItemColors: boolean;
  activeItemIndex: number | null;
  setActiveItemIndex: (index: number | null) => void;
  registerItemRef: (index: number, element: HTMLElement | null) => void;
  closeMenu: () => void;
  notifyItemClick: (content: ReactNode, index: number) => void;
}

export const DropdownMenuContext =
  createContext<DropdownMenuContextValue | null>(null);

export function useDropdownMenuContext() {
  return useContext(DropdownMenuContext);
}

export function mergeItemRef(
  index: number,
  registerItemRef: (index: number, element: HTMLElement | null) => void,
  ref?: Ref<HTMLElement>
) {
  return (element: HTMLElement | null) => {
    registerItemRef(index, element);

    if (typeof ref === 'function') {
      ref(element);
      return;
    }

    if (ref) {
      ref.current = element;
    }
  };
}
