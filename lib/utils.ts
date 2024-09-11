import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
