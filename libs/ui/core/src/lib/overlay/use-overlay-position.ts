/// <reference lib="dom" />

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  type RefObject,
} from 'react';

import {
  clampOverlayPosition,
  createFallbackOverlayPosition,
  resolveOverlayPlace,
  type OverlayPlace,
  type OverlayPosition,
} from './position';
import { getAnchorRect } from './utils';

export function useOverlayPosition({
  isOpen,
  mounted,
  anchorRef,
  panelRef,
  place,
  deps = [],
}: {
  isOpen: boolean;
  mounted: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  panelRef: RefObject<HTMLElement | null>;
  place?: OverlayPlace;
  deps?: unknown[];
}) {
  const [position, setPosition] = useState<OverlayPosition | null>(null);

  const updatePosition = useCallback(() => {
    const anchorRect = getAnchorRect(anchorRef.current);
    const panelRect = panelRef.current?.getBoundingClientRect();

    if (!anchorRect || !panelRect) {
      return;
    }

    const nextPosition = clampOverlayPosition(
      resolveOverlayPlace(
        anchorRect,
        panelRect.width,
        panelRect.height,
        place
      ),
      panelRect.width,
      panelRect.height
    );

    setPosition(nextPosition);
  }, [anchorRef, panelRef, place]);

  useLayoutEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    updatePosition();
  }, [isOpen, mounted, updatePosition, ...deps]);

  useEffect(() => {
    if (!isOpen || !mounted) {
      return;
    }

    const handleReposition = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, mounted, updatePosition]);

  return position ?? createFallbackOverlayPosition(place);
}
