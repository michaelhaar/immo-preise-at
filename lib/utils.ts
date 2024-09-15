import { InValue } from '@libsql/client';
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

export function transformNamedArgsToPositionalArgs({
  sql,
  args,
}: {
  sql: string;
  args: Record<string, InValue | string[]>;
}): { sql: string; args: InValue[] } {
  const positionalArgs: InValue[] = [];
  const transformedSql = sql.replace(/(:\w+)/g, (match) => {
    const argName = match.substring(1);
    const argValue = args[argName];

    if (argValue === undefined) {
      throw new Error(`Missing argument for ${argName}`);
    }

    if (Array.isArray(argValue)) {
      positionalArgs.push(...argValue);
      return argValue.map(() => '?').join(', ');
    }

    positionalArgs.push(argValue);
    return '?';
  });

  console.log('transformedSql', transformedSql);
  console.log('positionalArgs', positionalArgs);

  return { sql: transformedSql, args: positionalArgs };
}
