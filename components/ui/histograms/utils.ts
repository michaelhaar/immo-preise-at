export function getTotalCount(data: { count: number }[]) {
  return data.reduce((acc, row) => acc + row.count, 0);
}

export function getPercentage(totalCount: number, count: number) {
  return (count / totalCount) * 100;
}

export function getFormattedPercentage(totalCount: number, count: number) {
  return `${getPercentage(totalCount, count).toFixed(1)}%`;
}
