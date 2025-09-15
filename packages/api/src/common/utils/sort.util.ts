import { SortOrder } from '../enums/sort-order.enum';

export function getSortOptions(
  sort?: string,
  sortOrder?: SortOrder,
): { sort: string; sortOrder: 'ASC' | 'DESC' } {
  sort = sort || 'createdAt';
  sortOrder = sortOrder || SortOrder.DESC;

  const _sortOrder = sortOrder.toUpperCase() as 'ASC' | 'DESC';

  return { sort, sortOrder: _sortOrder };
}
