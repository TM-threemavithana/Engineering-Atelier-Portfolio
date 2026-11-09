/**
 * @file src/utils/tableCounter.ts
 * @description Page-scoped counter for generating distinct accessible labels for multiple tables on a page.
 */

const pageTableCounts = new Map<string, number>();

export function getNextTableIndex(pathname: string): number {
  const current = pageTableCounts.get(pathname) || 0;
  const next = current + 1;
  pageTableCounts.set(pathname, next);
  return next;
}

export function resetTableCounts(): void {
  pageTableCounts.clear();
}
