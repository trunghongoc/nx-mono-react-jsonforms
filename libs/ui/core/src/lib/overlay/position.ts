export type OverlayPlace =
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

export type OverlaySide = 'top' | 'bottom' | 'left' | 'right';

export type OverlayAlign = 'start' | 'center' | 'end';

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export interface OverlayPosition {
  top: number;
  left: number;
  place: OverlayPlace;
  arrow: {
    side: OverlaySide;
    offset: number;
  };
}

const GAP = 8;
const ARROW_SIZE = 8;
const ARROW_OFFSET = 16;
const VIEWPORT_PADDING = 8;

export const OVERLAY_PLACES: OverlayPlace[] = [
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

function getAnchorPoint(anchor: Rect, place: OverlayPlace) {
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
  place: OverlayPlace,
  overlayWidth: number
): number {
  if (place === 'top' || place === 'bottom') {
    return overlayWidth / 2;
  }

  if (place === 'topLeft' || place === 'bottomLeft') {
    return overlayWidth - ARROW_OFFSET;
  }

  return ARROW_OFFSET;
}

function getVerticalArrowOffset(
  place: OverlayPlace,
  overlayHeight: number
): number {
  if (place === 'left' || place === 'right') {
    return overlayHeight / 2;
  }

  if (place === 'leftTop' || place === 'rightTop') {
    return ARROW_OFFSET;
  }

  return overlayHeight - ARROW_OFFSET;
}

function getArrowSide(place: OverlayPlace): OverlaySide {
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

export function computeOverlayPosition(
  anchor: Rect,
  overlayWidth: number,
  overlayHeight: number,
  place: OverlayPlace
): OverlayPosition {
  const anchorPoint = getAnchorPoint(anchor, place);
  const arrowSide = getArrowSide(place);
  let top = 0;
  let left = 0;
  let arrowOffset = 0;

  if (place.startsWith('top')) {
    top = anchorPoint.y - overlayHeight - GAP - ARROW_SIZE;
    arrowOffset = getHorizontalArrowOffset(place, overlayWidth);
    left = anchorPoint.x - arrowOffset;
  } else if (place.startsWith('bottom')) {
    top = anchorPoint.y + GAP + ARROW_SIZE;
    arrowOffset = getHorizontalArrowOffset(place, overlayWidth);
    left = anchorPoint.x - arrowOffset;
  } else if (place.startsWith('left')) {
    left = anchorPoint.x - overlayWidth - GAP - ARROW_SIZE;
    arrowOffset = getVerticalArrowOffset(place, overlayHeight);
    top = anchorPoint.y - arrowOffset;
  } else {
    left = anchorPoint.x + GAP + ARROW_SIZE;
    arrowOffset = getVerticalArrowOffset(place, overlayHeight);
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

function getOverflow(
  position: OverlayPosition,
  overlayWidth: number,
  overlayHeight: number
) {
  const right = position.left + overlayWidth;
  const bottom = position.top + overlayHeight;
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

export function resolveOverlayPlace(
  anchor: Rect,
  overlayWidth: number,
  overlayHeight: number,
  preferredPlace?: OverlayPlace
): OverlayPosition {
  if (preferredPlace) {
    return computeOverlayPosition(
      anchor,
      overlayWidth,
      overlayHeight,
      preferredPlace
    );
  }

  let bestPosition = computeOverlayPosition(
    anchor,
    overlayWidth,
    overlayHeight,
    'top'
  );
  let bestScore = Number.POSITIVE_INFINITY;

  for (const place of OVERLAY_PLACES) {
    const position = computeOverlayPosition(
      anchor,
      overlayWidth,
      overlayHeight,
      place
    );
    const overflow = getOverflow(position, overlayWidth, overlayHeight);
    const score = scoreOverflow(overflow);

    if (score < bestScore) {
      bestScore = score;
      bestPosition = position;
    }
  }

  return bestPosition;
}

export function clampOverlayPosition(
  position: OverlayPosition,
  overlayWidth: number,
  overlayHeight: number
): OverlayPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const minLeft = VIEWPORT_PADDING;
  const maxLeft = viewportWidth - overlayWidth - VIEWPORT_PADDING;
  const minTop = VIEWPORT_PADDING;
  const maxTop = viewportHeight - overlayHeight - VIEWPORT_PADDING;

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

export function createFallbackOverlayPosition(
  place?: OverlayPlace
): OverlayPosition {
  return {
    top: -9999,
    left: -9999,
    place: place ?? 'top',
    arrow: { side: 'bottom', offset: 16 },
  };
}
