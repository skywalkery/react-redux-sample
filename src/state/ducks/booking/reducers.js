import R from 'ramda';
import { handleActions } from 'redux-actions';
import types from './types';

const INITIAL_STATE = {
  product: null,
  qty: 0,
  canOffer: false,
  prices: {},
  id: null,
  error: null,
  dataLoaded: false,
  cancelOfferId: null,
  previousOffer: null,
  shippingOptions: {},
  steps: [],
  paypal: null,
};

const reducer = handleActions({
  [types.BOOKING_RESET]: () => INITIAL_STATE,
  [types.BOOKING_DATA_LOADED]: state => R.merge(state, { dataLoaded: true }),
  [types.BOOKING_STARTED]: (state, { payload: { id, cancelOfferId } }) =>
    R.merge(state, { id, cancelOfferId, error: null }),
  [types.BOOKING_START_ERROR]: (state, { payload: error }) =>
    R.merge(state, { error }),
  [types.BOOKING_PRODUCT_FETCH_SUCCESS]: (state, { payload: { product, qty, canOffer } }) =>
    R.merge(state, { product, qty, canOffer }),
  [types.BOOKING_PRICES_FETCH_SUCCESS]: (state, { payload: prices }) =>
    R.merge(state, { prices }),
  [types.BOOKING_PRICES_ADD_VARIANT]: (state, { payload: prices }) =>
    R.mergeDeepRight(state, { prices }),
  [types.BOOKING_PREVIOUS_OFFER_FETCH_SUCCESS]: (state, { payload: previousOffer }) =>
    R.merge(state, { previousOffer }),
  [types.BOOKING_SHIPPING_OPTIONS_FETCH_SUCCESS]: (state, { payload: shippingOptions }) =>
    R.merge(state, { shippingOptions }),
  [types.BOOKING_SHIPPING_OPTIONS_FETCH_ERROR]: (state, { payload: error }) =>
    R.merge(state, { error }),
  [types.BOOKING_STEP_ADD]: (state, { payload: newStep }) =>
    R.merge(state, { steps: R.append(newStep, state.steps) }),
  [types.BOOKING_STEP_BACK]: state =>
    R.merge(state, { steps: R.dropLast(1, state.steps) }),
  [types.BOOKING_ADD_PAYPAL]: (state, { payload: { nonce, email } }) =>
    R.merge(state, { paypal: { nonce, email } }),
}, INITIAL_STATE);

export default reducer;
