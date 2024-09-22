export const dateRangeOptions = ['7T', '1M', '3M', '6M', '1J'] as const;
export type DateRangeOption = (typeof dateRangeOptions)[number];

export const defaultDateRangeOption = dateRangeOptions[1];

export const supportedHistogramColumnNames = [
  'livingArea',
  'purchasingPrice',
  'rent',
  'purchasingPricePerM2',
  'rentPerM2',
] as const;
export type SupportedHistogramColumnNames = (typeof supportedHistogramColumnNames)[number];
export function getHistogramColumnIndexByColumnName(column: SupportedHistogramColumnNames) {
  return supportedHistogramColumnNames.indexOf(column);
}
