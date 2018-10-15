import R from 'ramda';
import { takeLatest, take, put, fork, all, call, select } from 'redux-saga/effects';
import {
  change,
  startSubmit,
  stopSubmit,
  reset as resetForm,
  destroy,
  initialize as initializeForm,
} from 'redux-form';

import { showBuyrBar, waitResponse } from 'ducks/buyrBar/actions';
import { fetchCards, appendCard } from 'ducks/cards/actions';
import { fetchCartProducts, fetchProductsLocal, removeProductFromCart } from 'ducks/cartProducts/actions';
import { openOrder } from 'ducks/orderHistory/actions';
import { fetchOffers } from 'ducks/offers/actions';
import {
  update as updateConsumerAddresses,
  errorUnknown,
  append as appendAddress,
  clearErrors as clearAddressErrors,
} from 'ducks/addresses/actions';
import {
  BAR_TYPE_BOOK_OFFER,
  BAR_TYPE_BOOK_ORDER,
  BAR_TYPE_CART_HISTORY,
  BAR_TYPE_CART_OFFERS,
} from 'ducks/buyrBar/types';
import { userSelector, userPresentedSelector, isGuestSelector } from 'ducks/user/selectors';
import { ERROR_ADDRESS_UNKNOWN } from 'ducks/addresses/api';
import cardsTypes from 'ducks/cards/types';
import productApi from 'ducks/products/api';
import cardsApi from 'ducks/cards/api';
import offersApi from 'ducks/offers/api';
import setErrorIfPresent from 'helpers/apiErrorHandler';
import gtmPush, { trackPageview } from 'helpers/gtm';
import { trackOpenOrder, trackSubmitOffer, trackSubmitOrder } from 'helpers/segment';
import formSubmitErrorHandler from 'helpers/formSubmitErrorHandler';
import { ERROR_MESSAGES } from 'constants';
import {
  addPriceVariant,
  setProduct,
  fetchPrices,
  setPrices,
  setPricesError,
  startBooking,
  setBookingStarted,
  setBookingStartError,
  reset,
  setDataLoaded,
  setPriceVariantsLoaded,
  setPreviousOffer,
  setPreviousOfferError,
  setShippingOptions,
  setShippingOptionsError,
  fetchShippingOptions,
  addStep,
  backStep,
  addAddress,
} from './actions';
import { bookingSelectors } from '.';
import types from './types';
import api from './api';
import { STEPS } from './constants';

const formName = 'product-booking';

export function* getPreviousOffer(offerId) {
  yield put(waitResponse(true));
  try {
    const offer = yield call(offersApi.fetchOffer, offerId);
    if (offer.fulfillment) {
      offer.fulfillment = Number(offer.fulfillment);
    }
    yield put(setPreviousOffer(offer));
  } catch (error) {
    yield put(setPreviousOfferError());
  } finally {
    yield put(waitResponse(false));
  }
}

export function* showBar({
  payload: { productId, qty, canOffer, cancelOfferId, isProductPage, offerPrice },
}) {
  yield put(reset());
  yield put(showBuyrBar(canOffer ? BAR_TYPE_BOOK_OFFER : BAR_TYPE_BOOK_ORDER));
  yield put(waitResponse(true));

  const userPresented = yield select(userPresentedSelector);

  try {
    const product = yield call(productApi.queryCertainProduct, { productId });
    // fetch in parallel, then wait all
    // if user presented fetch cards, addresses and fix prices
    // otherwise do nothing
    yield all([
      put(setProduct({ product, qty, canOffer })),
      put(fetchShippingOptions()),
      userPresented ? put(fetchCards()) : null,
      userPresented ? put(fetchPrices({
        canOffer,
        productId,
        priceModelId: product.priceModelId,
        cancelOfferId,
      })) : null,
      cancelOfferId ? fork(getPreviousOffer, cancelOfferId) : null,
    ]);
    yield all([
      userPresented ? take(cardsTypes.CARDS_FETCH_SUCCESS) : null,
      userPresented ? take([
        types.BOOKING_PRICE_VARIANTS_FETCH_SUCCESS,
        types.BOOKING_PRICES_FETCH_ERROR,
      ]) : null,
      take([
        types.BOOKING_SHIPPING_OPTIONS_FETCH_SUCCESS,
        types.BOOKING_SHIPPING_OPTIONS_FETCH_ERROR,
      ]),
    ]);
    yield put(addStep(userPresented ? STEPS.MAIN : STEPS.GUEST_START));
    yield put(setDataLoaded());

    if (canOffer && offerPrice) {
      yield put(change(formName, 'price', Number(offerPrice).toFixed(2)));
    }

    trackOpenOrder(product, canOffer);
    trackPageview('/booking/open', 'Form opened');
    const gtmAction = canOffer ? 'Make An Offer' : 'Buy Now';
    const gtmSuffix = isProductPage ? ' Product Page' : ' Cart Page';
    gtmPush(gtmAction, `${gtmAction}${gtmSuffix}`, product.urlKey, qty);
  } finally {
    yield put(waitResponse(false));
  }
}

export function* fetchProductPrices({
  payload: { canOffer, productId, priceModelId, cancelOfferId },
}) {
  yield put(waitResponse(true));

  try {
    yield put(startBooking({ canOffer, productId, priceModelId, cancelOfferId }));
    const action = yield take([types.BOOKING_STARTED, types.BOOKING_START_ERROR]);
    if (action.type === types.BOOKING_STARTED) {
      const { payload: { prices, addresses } } = action;
      const consumerAddresses = R.filter(addr => addr.type === 'consumer', addresses);
      const defaultConsumerAddress = R.keys(R.filter(addr => addr.type === 'consumer' && addr.default, addresses))[0] || null;
      yield put(setPrices(prices));
      yield put(updateConsumerAddresses({
        addresses: consumerAddresses,
        defaultAddress: defaultConsumerAddress,
      }));
      yield put(setPriceVariantsLoaded());
      if (defaultConsumerAddress) {
        trackPageview('/booking/address', 'Address added');
      }
    } else {
      yield put(setPricesError());
    }
  } catch (error) {
    yield put(setPricesError());
  } finally {
    yield put(waitResponse(false));
  }
}

export function* addAddressToOrder({ payload }) {
  const initiallyFormName = payload.formName;
  yield put(waitResponse(true));
  yield put(startSubmit(initiallyFormName));
  try {
    const body = R.omit(['bookingId', 'formName'], payload);
    const priceVariants = yield call(api.addAddressToOrder, {
      ...body,
      orderId: payload.bookingId,
    });
    const { address, prices } = priceVariants;
    yield put(appendAddress(address));
    const keys = R.keys(prices);
    // eslint-disable-next-line
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      yield put(addPriceVariant({ [key]: prices[key] }));
    }
    yield put(change(formName, 'customerAddress', address['@id']));
    yield put(stopSubmit(initiallyFormName));
    yield put(backStep());
    trackPageview('/booking/address', 'Address added');
  } catch (error) {
    if (error === ERROR_ADDRESS_UNKNOWN) {
      yield put(errorUnknown());
      yield put(stopSubmit(initiallyFormName));
    } else {
      yield* formSubmitErrorHandler(error, initiallyFormName);
    }
  } finally {
    yield put(waitResponse(false));
  }
}

export function* addCardToOrder({ payload }) {
  const initiallyFormName = payload.formName;
  yield put(waitResponse(true));
  yield put(startSubmit(initiallyFormName));
  try {
    const card = yield call(cardsApi.addCard, payload);
    yield put(appendCard(card));
    yield put(change(formName, 'paymentMethodId', card.id));
    yield put(stopSubmit(initiallyFormName));
    yield put(backStep());
  } catch (error) {
    yield* formSubmitErrorHandler(error, initiallyFormName);
  } finally {
    yield put(waitResponse(false));
  }
}

export function* onStartBooking({ payload: { productId, priceModelId, canOffer, cancelOfferId } }) {
  yield put(waitResponse(true));
  try {
    const booking = yield call(api.startBooking, { productId, priceModelId, canOffer });
    yield put(setBookingStarted({ ...booking, cancelOfferId }));
  } catch (error) {
    yield* setErrorIfPresent(error, ERROR_MESSAGES.COMMON, setBookingStartError);
  } finally {
    yield put(waitResponse(false));
  }
}

export function* submitBooking({ payload }) {
  const formData = payload.data;
  yield put(waitResponse(true));
  yield put(startSubmit(formName));
  try {
    const { customerAddress, canOffer } = formData;

    const data = R.omit(
      ['customerAddress', 'totalPrice', 'paymentMethodId'],
      R.merge(formData, { deliveryAddressId: customerAddress }),
    );
    yield call(api.submit, data);
    yield put(resetForm(formName));
    yield put(stopSubmit(formName));

    const price = yield select(state => state.booking.product.price);
    if (canOffer) {
      yield put(showBuyrBar(BAR_TYPE_CART_OFFERS));
      yield put(openOrder({ orderId: data.bookingId }));

      trackSubmitOffer(formData, price);
      trackPageview('/booking/submit/offer', 'Offer Submitted');
    } else {
      yield put(showBuyrBar(BAR_TYPE_CART_HISTORY));
      yield put(openOrder({ orderId: data.bookingId, justBought: true }));

      trackSubmitOrder(formData, price);
      trackPageview('/booking/submit/order', 'Order Submitted');
    }
    yield put(fetchCartProducts());
    yield put(fetchOffers());

    const isGuest = yield select(isGuestSelector);
    if (isGuest) {
      const productId = yield select(bookingSelectors.productIdSelector);
      yield put(removeProductFromCart({ product: productId }));
      yield put(fetchProductsLocal());
    }
  } catch (error) {
    yield* formSubmitErrorHandler(error, formName);
  } finally {
    yield put(waitResponse(false));
  }

  const user = yield select(userSelector);
  const productUrlKey = yield select(bookingSelectors.productUrlKeySelector);
  const gtmAction = formData.canOffer ? 'Make An Offer' : 'Buy Now';
  gtmPush(gtmAction, `${gtmAction} Checkout Page`, productUrlKey, formData.qty, user.email);
}

export function* destroyMe() {
  yield put(destroy(formName));
}

export function* getShippingOptions() {
  yield put(waitResponse(true));
  try {
    const options = yield call(api.getShippingOptions);
    yield put(setShippingOptions(options));
  } catch (error) {
    yield put(setShippingOptionsError());
  } finally {
    yield put(waitResponse(false));
  }
}

export function* addPaypalToOrder({ payload }) {
  const { bookingId, newAddress } = payload;
  yield put(change(formName, 'paymentMethodId', payload.nonce));
  if (newAddress) {
    yield put(clearAddressErrors());
    yield put(addStep(STEPS.ADD_ADDRESS));
    yield put(initializeForm('address', newAddress, { keepDirty: false, keepValues: false }));
    yield put(resetForm('address'));
    yield put(addAddress({ ...newAddress, bookingId }));
  }
}

export default function* root() {
  yield fork(() => takeLatest(types.BOOKING_EDIT, showBar));
  yield fork(() => takeLatest(types.BOOKING_PRICES_FETCH, fetchProductPrices));
  yield fork(() => takeLatest(types.BOOKING_ADD_ADDRESS, addAddressToOrder));
  yield fork(() => takeLatest(types.BOOKING_ADD_CARD, addCardToOrder));
  yield fork(() => takeLatest(types.BOOKING_START, onStartBooking));
  yield fork(() => takeLatest(types.BOOKING_SUBMIT, submitBooking));
  yield fork(() => takeLatest(types.BOOKING_FORM_DESTROY, destroyMe));
  yield fork(() => takeLatest(types.BOOKING_SHIPPING_OPTIONS_FETCH, getShippingOptions));
  yield fork(() => takeLatest(types.BOOKING_ADD_PAYPAL, addPaypalToOrder));
}
