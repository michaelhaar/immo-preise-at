import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DateRangeOption, dateRangeOptions, defaultDateRangeOption } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];

  if (typeof value !== 'string') {
    throw new Error(`Missing ${name} environment variable`);
  }

  return value;
}

type FormatNumberOptions = {
  decimalPlaces?: number;
  unit?: string;
};

const defaultFormatNumberOptions: FormatNumberOptions = {
  decimalPlaces: 2,
  unit: '',
};

export function formatNumber(number: number | null, optionOverrides?: FormatNumberOptions): string {
  if (number === null) {
    return '';
  }

  const options = { ...defaultFormatNumberOptions, ...optionOverrides };

  const formatter = new Intl.NumberFormat('de-DE', {
    style: 'decimal',
    minimumFractionDigits: options.decimalPlaces,
    maximumFractionDigits: options.decimalPlaces,
  });

  return options.unit ? `${formatter.format(number)} ${options.unit}` : formatter.format(number);
}

export function sanitizePostalCodesString(value: string): string {
  return value.replace(/[^0-9 ]/g, '');
}

export function isDateRangeOption(value: string | null): value is DateRangeOption {
  return dateRangeOptions.includes(value as DateRangeOption);
}

export function parseDateRange(value: string | null): DateRangeOption {
  return isDateRangeOption(value) ? value : defaultDateRangeOption;
}
