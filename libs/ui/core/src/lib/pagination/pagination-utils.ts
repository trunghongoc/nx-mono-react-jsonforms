export type PaginationPageItem = number | 'ellipsis-start' | 'ellipsis-end';

const defaultPageItemCount = 7;
const defaultBoundaryCount = 1;

/**
 * Derives sibling count from the max page-number buttons to show.
 * Formula: pageItemCount = siblingCount * 2 + 3 + boundaryCount * 2
 */
export function getSiblingCountFromPageItemCount(
  pageItemCount: number,
  boundaryCount = defaultBoundaryCount
) {
  return Math.max(
    0,
    Math.floor((pageItemCount - 3 - boundaryCount * 2) / 2)
  );
}

/**
 * Builds the list of page numbers and ellipsis markers to render.
 * Shows all pages when the total is small; otherwise collapses with ellipsis.
 */
export function getPaginationPageItems(
  current: number,
  totalPages: number,
  pageItemCount = defaultPageItemCount,
  boundaryCount = defaultBoundaryCount
): PaginationPageItem[] {
  const siblingCount = getSiblingCountFromPageItemCount(
    pageItemCount,
    boundaryCount
  );
  if (totalPages <= 0) {
    return [];
  }

  const totalPageNumbers = siblingCount * 2 + 3 + boundaryCount * 2;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(
    current - siblingCount,
    boundaryCount + 1
  );
  const rightSiblingIndex = Math.min(
    current + siblingCount,
    totalPages - boundaryCount
  );

  const showLeftEllipsis = leftSiblingIndex > boundaryCount + 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - boundaryCount - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [
      ...range(1, leftItemCount),
      'ellipsis-end',
      totalPages,
    ];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [
      1,
      'ellipsis-start',
      ...range(totalPages - rightItemCount + 1, totalPages),
    ];
  }

  if (showLeftEllipsis && showRightEllipsis) {
    return [
      1,
      'ellipsis-start',
      ...range(leftSiblingIndex, rightSiblingIndex),
      'ellipsis-end',
      totalPages,
    ];
  }

  return range(1, totalPages);
}

function range(start: number, end: number): number[] {
  const length = end - start + 1;
  return Array.from({ length }, (_, index) => start + index);
}

export function getTotalPages(totalItems: number, pageSize: number) {
  if (pageSize <= 0 || totalItems <= 0) {
    return 0;
  }

  return Math.ceil(totalItems / pageSize);
}
