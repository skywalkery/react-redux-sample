/* eslint-disable max-len */
import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form';
import { addressSelectors } from 'ducks/addresses';
import { cardsSelectors } from 'ducks/cards';
import R from 'ramda';
import Decimal from 'decimal.js';

import numberWithCommas from 'helpers/numberWithCommas';

const fulfillmentInitial = 1;

const formSelector = formValueSelector('product-booking');
const fulfillmentSelector = state => formSelector(state, 'fulfillment') ||
  state.booking.shippingOptions.defaultShippingRate ||
  fulfillmentInitial;
const previousOfferFulfillmentSelector = state => state.booking.previousOffer ?
  state.booking.previousOffer.fulfillment : null;
const customerAddressSelector = state => formSelector(state, 'customerAddress') || addressSelectors.customerDeliveryAddress(state);
const priceSelector = state => formSelector(state, 'price') || '0';
const qtySelector = state => formSelector(state, 'qty') || state.booking.qty;
const priceVariantsSelector = state => state.booking.prices;
const canOfferSelector = state => state.booking.canOffer;
const previousOfferSelector = state => state.booking.previousOffer;
const productIdSelector = state => state.booking.product['@id'];
const productUrlKeySelector = state => state.booking.urlKey;
const productPriceSelector = state => state.booking.product.price;

const fulfillmentOptionsSelector = state => R.ifElse(
  R.isEmpty,
  R.always([]),
  () => R.map(({ id, name }) => ({ label: name, id }), state.booking.shippingOptions.shippingRates),
)(state.booking.shippingOptions);

const defaultShippingOptionIdSelector = state => state.booking.shippingOptions && state.booking.shippingOptions.defaultShippingRate || undefined;

const combinedFullfilmentOptionsSelector = (
  fullfillmentOptions,
  customerAddress,
  priceVariants,
  defaultShippingOptionId,
) => {
  const defaultShippingKey = `${customerAddress}:${defaultShippingOptionId}`;
  const defaultPrice = priceVariants[defaultShippingKey] || 0;
  const shippingCosts = {};
  R.forEachObjIndexed((value, key) => {
    if (R.startsWith(customerAddress, key)) {
      const parts = key.split(':');
      shippingCosts[Number(parts[1])] = Decimal.sub(value, defaultPrice).toNumber();
    }
  }, priceVariants);
  return R.map(opt => ({
    ...opt,
    label: { name: opt.label, cost: shippingCosts[opt.id] && numberWithCommas(shippingCosts[opt.id]) },
  }), fullfillmentOptions);
};

const previousPrice = previousOffer => (previousOffer && previousOffer.price) || undefined;

const currentPriceSelector = (fulfillment, customerAddress, priceVariants, productPrice) => (
  priceVariants[`${customerAddress}:${fulfillment}`] || productPrice
);

const totalPrice = (
  canOffer,
  price,
  qty,
  fulfillment,
  customerAddress,
  priceVariants,
  productPrice,
) => {
  if (canOffer) {
    const cleanPrice = `${price},`.replace(/,/g, '').replace(/\$/g, '');
    return Decimal
      .mul(Number(cleanPrice), qty)
      .toNumber();
  }

  return Decimal
    .mul(currentPriceSelector(fulfillment,
      customerAddress,
      priceVariants,
      productPrice) || 0, qty)
    .toNumber();
};

const fulfillment = (previousOfferFulfillment, currentFullfilment) => (
  previousOfferFulfillment || currentFullfilment
);

const lastScreenStep = state => R.last(state.booking.steps);

const offerPriceSelector = (price) => {
  const cleanPrice = `${price},`.replace(/,/g, '').replace(/\$/g, '');
  return Number(cleanPrice);
};

const paypalSelector = state => state.booking.paypal;

const paymentMethodsSelector = (cards, paypal) => {
  let arr = [...cards];
  if (paypal) {
    arr = R.append({ type: 'Paypal', brand: 'Paypal', id: paypal.nonce, nonce: paypal.nonce, email: paypal.email }, arr);
  }
  return arr;
};

const paymentMethodIdSelector = state => formSelector(state, 'paymentMethodId');

const paymentMethodSelector = (paymentMethods, paymentMethodId) =>
  (R.find(R.propEq('id', paymentMethodId))(paymentMethods));

const paymentMethods = createSelector(
  cardsSelectors.cards,
  paypalSelector,
  paymentMethodsSelector,
);

const addressesSelector = state => state.addresses.addresses;
const shippingAddressSelector = (addresses, currentAddressId) => {
  const addr = addresses[currentAddressId];
  return {
    ...addr,
    id: currentAddressId,
    '@id': currentAddressId,
  };
};

export default {
  currentPrice: createSelector(fulfillmentSelector,
    customerAddressSelector,
    priceVariantsSelector,
    productPriceSelector,
    currentPriceSelector),
  totalPrice: createSelector(canOfferSelector,
    priceSelector,
    qtySelector,
    fulfillmentSelector,
    customerAddressSelector,
    priceVariantsSelector,
    productPriceSelector,
    totalPrice),
  price: createSelector(previousOfferSelector,
    previousPrice),
  fulfillmentOptions: createSelector(fulfillmentOptionsSelector,
    customerAddressSelector,
    priceVariantsSelector,
    defaultShippingOptionIdSelector,
    combinedFullfilmentOptionsSelector),
  fulfillment: createSelector(previousOfferFulfillmentSelector,
    fulfillmentSelector,
    fulfillment),
  lastScreenStep,
  offerPrice: createSelector(priceSelector,
    offerPriceSelector),
  customerAddress: customerAddressSelector,
  paymentMethods,
  paymentMethod: createSelector(paymentMethods,
    paymentMethodIdSelector,
    paymentMethodSelector),
  shippingAddress: createSelector(addressesSelector,
    customerAddressSelector,
    shippingAddressSelector),
  productIdSelector,
  productUrlKeySelector,
};
