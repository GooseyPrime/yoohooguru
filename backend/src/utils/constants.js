/**
 * Shared constants for the backend application
 * @module utils/constants
 */

/**
 * Supported currencies for payments and payouts
 * @constant {string[]}
 */
const SUPPORTED_CURRENCIES = ['usd', 'eur', 'gbp'];

/**
 * Minimum payout amount in cents
 * @constant {number}
 */
const MIN_PAYOUT_AMOUNT_CENTS = 1;

/**
 * Minimum payment amount in cents
 * @constant {number}
 */
const MIN_PAYMENT_AMOUNT_CENTS = 50;

module.exports = {
  SUPPORTED_CURRENCIES,
  MIN_PAYOUT_AMOUNT_CENTS,
  MIN_PAYMENT_AMOUNT_CENTS
};
