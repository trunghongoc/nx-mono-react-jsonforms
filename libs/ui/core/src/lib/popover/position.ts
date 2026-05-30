export type PopoverPlace =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

export type PopoverSide = 'top' | 'bottom' | 'left' | 'right';

export type PopoverAlign = 'start' | 'center' | 'end';

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface PopoverPosition {
  top: number;
  left: number;
  place: PopoverPlace;
  arrow: {
    side: PopoverSide;
    offset: number;
  };
}

const GAP = 8;
const ARROW_SIZE = 8;
const ARROW_OFFSET = 16;
const VIEWPORT_PADDING = 8;

export const POPOVER_PLACES: PopoverPlace[] = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
  'left',
  'leftTop',
  'leftBottom',
  'right',
  'rightTop',
  'rightBottom',
];

function getAnchorPoint(anchor: Rect, place: PopoverPlace) {
  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;

  if (place.startsWith('top')) {
    return { x: centerX, y: anchor.top };
  }

  if (place.startsWith('bottom')) {
    return { x: centerX, y: anchor.top + anchor.height };
  }

  if (place.startsWith('left')) {
    return { x: anchor.left, y: centerY };
  }

  return { x: anchor.left + anchor.width, y: centerY };
}

function getHorizontalArrowOffset(
  place: PopoverPlace,
  popoverWidth: number
): number {
  if (place === 'top' || place === 'bottom') {
    return popoverWidth / 2;
  }

  if (place === 'topLeft' || place === 'bottomLeft') {
    return popoverWidth - ARROW_OFFSET;
  }

  return ARROW_OFFSET;
}

function getVerticalArrowOffset(
  place: PopoverPlace,
  popoverHeight: number
): number {
  if (place === 'left' || place === 'right') {
    return popoverHeight / 2;
  }

  if (place === 'leftTop' || place === 'rightTop') {
    return ARROW_OFFSET;
  }

  return popoverHeight - ARROW_OFFSET;
}

function getArrowSide(place: PopoverPlace): PopoverSide {
  if (place.startsWith('top')) {
    return 'bottom';
  }

  if (place.startsWith('bottom')) {
    return 'top';
  }

  if (place.startsWith('left')) {
    return 'right';
  }

  return 'left';
}

export function computePopoverPosition(
  anchor: Rect,
  popoverWidth: number,
  popoverHeight: number,
  place: PopoverPlace
): PopoverPosition {
  const anchorPoint = getAnchorPoint(anchor, place);
  const arrowSide = getArrowSide(place);
  let top = 0;
  let left = 0;
  let arrowOffset = 0;

  if (place.startsWith('top')) {
    top = anchorPoint.y - popoverHeight - GAP - ARROW_SIZE;
    arrowOffset = getHorizontalArrowOffset(place, popoverWidth);
    left = anchorPoint.x - arrowOffset;
  } else if (place.startsWith('bottom')) {
    top = anchorPoint.y + GAP + ARROW_SIZE;
    arrowOffset = getHorizontalArrowOffset(place, popoverWidth);
    left = anchorPoint.x - arrowOffset;
  } else if (place.startsWith('left')) {
    left = anchorPoint.x - popoverWidth - GAP - ARROW_SIZE;
    arrowOffset = getVerticalArrowOffset(place, popoverHeight);
    top = anchorPoint.y - arrowOffset;
  } else {
    left = anchorPoint.x + GAP + ARROW_SIZE;
    arrowOffset = getVerticalArrowOffset(place, popoverHeight);
    top = anchorPoint.y - arrowOffset;
  }

  return {
    top,
    left,
    place,
    arrow: {
      side: arrowSide,
      offset: arrowOffset,
    },
  };
}

function getOverflow(position: PopoverPosition, popoverWidth: number, popoverHeight: number) {
  const right = position.left + popoverWidth;
  const bottom = position.top + popoverHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  return {
    top: Math.max(0, VIEWPORT_PADDING - position.top),
    left: Math.max(0, VIEWPORT_PADDING - position.left),
    right: Math.max(0, right - (viewportWidth - VIEWPORT_PADDING)),
    bottom: Math.max(0, bottom - (viewportHeight - VIEWPORT_PADDING)),
    total: 0,
  };
}

function scoreOverflow(overflow: ReturnType<typeof getOverflow>) {
  overflow.total =
    overflow.top + overflow.left + overflow.right + overflow.bottom;
  return overflow.total;
}

export function resolvePopoverPlace(
  anchor: Rect,
  popoverWidth: number,
  popoverHeight: number,
  preferredPlace?: PopoverPlace
): PopoverPosition {
  if (preferredPlace) {
    return computePopoverPosition(
      anchor,
      popoverWidth,
      popoverHeight,
      preferredPlace
    );
  }

  let bestPosition = computePopoverPosition(
    anchor,
    popoverWidth,
    popoverHeight,
    'top'
  );
  let bestScore = Number.POSITIVE_INFINITY;

  for (const place of POPOVER_PLACES) {
    const position = computePopoverPosition(
      anchor,
      popoverWidth,
      popoverHeight,
      place
    );
    const overflow = getOverflow(position, popoverWidth, popoverHeight);
    const score = scoreOverflow(overflow);

    if (score < bestScore) {
      bestScore = score;
      bestPosition = position;
    }
  }

  return bestPosition;
}

export function clampPopoverPosition(
  position: PopoverPosition,
  popoverWidth: number,
  popoverHeight: number
): PopoverPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const minLeft = VIEWPORT_PADDING;
  const maxLeft = viewportWidth - popoverWidth - VIEWPORT_PADDING;
  const minTop = VIEWPORT_PADDING;
  const maxTop = viewportHeight - popoverHeight - VIEWPORT_PADDING;

  const nextLeft = Math.min(Math.max(position.left, minLeft), maxLeft);
  const nextTop = Math.min(Math.max(position.top, minTop), maxTop);

  return {
    ...position,
    left: nextLeft,
    top: nextTop,
    arrow: {
      ...position.arrow,
      offset:
        position.arrow.side === 'top' || position.arrow.side === 'bottom'
          ? position.arrow.offset + (position.left - nextLeft)
          : position.arrow.offset + (position.top - nextTop),
    },
  };
}
