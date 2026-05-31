import { createContext, useContext, type ReactNode, type Ref } from 'react';

export interface DropdownMenuContextValue {
  useCustomItemColors: boolean;
  activeItemIndex: number | null;
  setActiveItemIndex: (index: number | null) => void;
  openSubMenuIndex: number | null;
  setOpenSubMenuIndex: (index: number | null) => void;
  allocateItemIndex: () => number;
  registerItemRef: (
    index: number,
    element: HTMLElement | null,
    disabled?: boolean
  ) => void;
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
  registerItemRef: (
    index: number,
    element: HTMLElement | null,
    disabled?: boolean
  ) => void,
  ref?: Ref<HTMLElement>,
  disabled = false
) {
  return (element: HTMLElement | null) => {
    registerItemRef(index, element, disabled);

    if (typeof ref === 'function') {
      ref(element);
      return;
    }

    if (ref) {
      ref.current = element;
    }
  };
}
