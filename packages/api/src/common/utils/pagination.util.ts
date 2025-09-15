export function toLimit(
  pageSize?: number,
  defaultLimit: number = 10,
  maxLimit: number = 100,
): number {
  let limit = pageSize ?? defaultLimit;

  if (limit > maxLimit) {
    limit = maxLimit;
  }

  return limit;
}

export function toSkip(page?: number, limit?: number): number {
  const currentPage = page && page > 0 ? page : 1;
  const currentLimit = limit && limit > 0 ? limit : 10;

  return (currentPage - 1) * currentLimit;
}

export function toPageCount(total: number, limit?: number): number {
  const currentLimit = limit && limit > 0 ? limit : total;

  return Math.ceil(total / currentLimit);
}
