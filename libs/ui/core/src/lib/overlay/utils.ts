/// <reference lib="dom" />

import type { CSSProperties, Ref } from 'react';

import type { OverlaySide } from './position';

export function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ');
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) {
        continue;
      }

      if (typeof ref === 'function') {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}

export function getAnchorRect(element: HTMLElement | null) {
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

const ARROW_DIAMOND_SIZE = 8;
const ARROW_BORDER_SIZE = 4;
const TOOLTIP_ARROW_COLOR = 'var(--color-bg-spotlight)';

export function getArrowStyle(
  side: OverlaySide,
  offset: number
): CSSProperties {
  const size = ARROW_DIAMOND_SIZE;

  if (side === 'top') {
    return {
      top: -size / 2,
      left: offset,
      transform: 'translateX(-50%) rotate(45deg)',
    };
  }

  if (side === 'bottom') {
    return {
      bottom: -size / 2,
      left: offset,
      transform: 'translateX(-50%) rotate(45deg)',
    };
  }

  if (side === 'left') {
    return {
      left: -size / 2,
      top: offset,
      transform: 'translateY(-50%) rotate(45deg)',
    };
  }

  return {
    right: -size / 2,
    top: offset,
    transform: 'translateY(-50%) rotate(45deg)',
  };
}

export function getBorderArrowStyle(
  side: OverlaySide,
  offset: number,
  color = TOOLTIP_ARROW_COLOR
): CSSProperties {
  const size = ARROW_BORDER_SIZE;
  const base: CSSProperties = {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    background: 'transparent',
  };

  if (side === 'top') {
    return {
      ...base,
      top: -size,
      left: offset,
      transform: 'translateX(-50%)',
      borderWidth: `0 ${size}px ${size}px`,
      borderColor: `transparent transparent ${color}`,
    };
  }

  if (side === 'bottom') {
    return {
      ...base,
      bottom: -size,
      left: offset,
      transform: 'translateX(-50%)',
      borderWidth: `${size}px ${size}px 0`,
      borderColor: `${color} transparent transparent`,
    };
  }

  if (side === 'left') {
    return {
      ...base,
      left: -size,
      top: offset,
      transform: 'translateY(-50%)',
      borderWidth: `${size}px ${size}px ${size}px 0`,
      borderColor: `transparent ${color} transparent transparent`,
    };
  }

  return {
    ...base,
    right: -size,
    top: offset,
    transform: 'translateY(-50%)',
    borderWidth: `${size}px 0 ${size}px ${size}px`,
    borderColor: `transparent transparent transparent ${color}`,
  };
}
