import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma obj to regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  console.log(error.errors);
  if (error.name === 'ZodError') {
    const fieldErrors = Object.keys(error.errors).map((field) => {
      return error.errors[field].message;
    });
    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error);
  }
}

// round number function
export function roundNumber(num: number | string): number {
  if (typeof num === 'string') {
    return Math.round((Number(num) + Number.EPSILON) * 100) / 100;
  } else if (typeof num === 'number') {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value is not a number or a string');
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

export function formatCurrency(num: number | string | null) {
  if (typeof num === 'string') {
    return CURRENCY_FORMATTER.format(Number(num));
  } else if (typeof num === 'number') {
    return CURRENCY_FORMATTER.format(num);
  }
  return 'NaN';
}
