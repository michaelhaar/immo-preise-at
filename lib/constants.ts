export const dateRangeOptions = ['7T', '1M', '3M', '6M', '1J'] as const;
export type DateRangeOption = (typeof dateRangeOptions)[number];

export const defaultDateRangeOption = dateRangeOptions[1];
