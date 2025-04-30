
import { PaginationState } from '../../setupTypes';

// Default pagination state
export const defaultPaginationState: PaginationState = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 1
};

/**
 * Paginate an array of items
 */
export const paginateItems = <T>(items: T[], page: number, itemsPerPage: number): T[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return items.slice(startIndex, endIndex);
};

/**
 * Get pagination state for a set of items
 */
export const getPaginationState = <T>(items: T[], currentPage: number, itemsPerPage: number): PaginationState => {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return {
    currentPage: Math.min(Math.max(1, currentPage), totalPages || 1),
    itemsPerPage,
    totalItems,
    totalPages: totalPages || 1
  };
};
