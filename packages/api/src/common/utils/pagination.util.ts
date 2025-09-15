import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../constants/pagination.constant';

export function getPaginationOptions(
  pageSize?: number,
  page?: number,
): { take: number; skip: number; pageSize: number; page: number } {
  pageSize = pageSize || DEFAULT_PAGE_SIZE;
  pageSize = pageSize > MAX_PAGE_SIZE ? MAX_PAGE_SIZE : pageSize;
  page = page || DEFAULT_PAGE;

  const take = pageSize;
  const skip = (page - 1) * pageSize;

  return { take, skip, pageSize, page };
}

export function toPageCount(total: number, limit: number): number {
  return Math.ceil(total / limit);
}
