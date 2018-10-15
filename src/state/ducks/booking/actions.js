import { createAction } from 'redux-actions';
import types from './types';

export const startBooking = createAction(types.BOOKING_START);
export const submitBooking = createAction(types.BOOKING_SUBMIT);
export const setBookingStarted = createAction(types.BOOKING_STARTED);
export const setBookingStartError = createAction(types.BOOKING_START_ERROR);
export const editBooking = createAction(types.BOOKING_EDIT);
export const setProduct = createAction(types.BOOKING_PRODUCT_FETCH_SUCCESS);
export const fetchPrices = createAction(types.BOOKING_PRICES_FETCH);
export const setPrices = createAction(types.BOOKING_PRICES_FETCH_SUCCESS);
export const addPriceVariant = createAction(types.BOOKING_PRICES_ADD_VARIANT);
export const setPricesError = createAction(types.BOOKING_PRICES_FETCH_ERROR);
export const addAddress = createAction(types.BOOKING_ADD_ADDRESS);
export const reset = createAction(types.BOOKING_RESET);
export const setDataLoaded = createAction(types.BOOKING_DATA_LOADED);
export const addCard = createAction(types.BOOKING_ADD_CARD);
export const setPriceVariantsLoaded = createAction(types.BOOKING_PRICE_VARIANTS_FETCH_SUCCESS);
export const setPreviousOffer = createAction(types.BOOKING_PREVIOUS_OFFER_FETCH_SUCCESS);
export const setPreviousOfferError = createAction(types.BOOKING_PREVIOUS_OFFER_FETCH_ERROR);
export const destroyForm = createAction(types.BOOKING_FORM_DESTROY);
export const fetchShippingOptions = createAction(types.BOOKING_SHIPPING_OPTIONS_FETCH);
export const setShippingOptions = createAction(types.BOOKING_SHIPPING_OPTIONS_FETCH_SUCCESS);
export const setShippingOptionsError = createAction(types.BOOKING_SHIPPING_OPTIONS_FETCH_ERROR);
export const addStep = createAction(types.BOOKING_STEP_ADD);
export const backStep = createAction(types.BOOKING_STEP_BACK);
export const addPaypal = createAction(types.BOOKING_ADD_PAYPAL);

export default {
  startBooking,
  submitBooking,
  setBookingStarted,
  setBookingStartError,
  addPriceVariant,
  editBooking,
  setProduct,
  fetchPrices,
  setPrices,
  setPricesError,
  addAddress,
  reset,
  setDataLoaded,
  addCard,
  setPriceVariantsLoaded,
  setPreviousOffer,
  setPreviousOfferError,
  destroyForm,
  fetchShippingOptions,
  setShippingOptions,
  setShippingOptionsError,
  addStep,
  backStep,
  addPaypal,
};
