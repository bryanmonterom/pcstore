import { ShippingAddress } from '../../types/index';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ProStore';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern ecommerce store built with nextJs';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  email: '',
  name: '',
  password: '',
  confirmPassword: '',
};

export const COOKIE_NAMES = {
  SESSION_CART_ID: 'sessionCartId',
};

export const shippingAddressDefaultValues: ShippingAddress = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS ? process.env.PAYMENT_METHODS.split(',') : ['Paypal', 'Stripe', 'CashOnDelivery'];
export const DEFAULT_PAYMENT_METHOD = process.env.DEFAULT_PAYMENT_METHOD || "Paypal"	;

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 2