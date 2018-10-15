import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, Field } from 'redux-form';
import { compose, branch, renderComponent, componentFromProp } from 'recompose';
import R from 'ramda';

import { cardsSelectors } from 'ducks/cards';
import { bookingActions, bookingSelectors } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import { addressSelectors } from 'ducks/addresses';
import { userSelectors } from 'ducks/user';
import { buyrBarActions } from 'ducks/buyrBar';
import styled from 'hocs/styled';
import formLoader from './ProductBookingFormLoader';
import ProductSnippet from './ProductSnippet';
import MainScreen from './steps/MainScreen';
import GuestStartScreen from './steps/GuestStartScreen';
import CreateAccountScreen from './steps/CreateAccountScreen';
import SignInScreen from './steps/SignInScreen';
import AddContactScreen from './steps/AddContactScreen';
import AddAddressScreen from './steps/AddAddressScreen';
import AddCardScreen from './steps/AddCardScreen';
import StartError from './StartError';
import BackBar from './BackBar';
import prepareData from './onSubmit';
import validate from './validate';
import styles from './styles.scss';

const stepMapping = {
  [STEPS.GUEST_START]: GuestStartScreen,
  [STEPS.CREATE_ACCOUNT]: CreateAccountScreen,
  [STEPS.SIGN_IN]: SignInScreen,
  [STEPS.ADD_CONTACT]: AddContactScreen,
  [STEPS.ADD_ADDRESS]: AddAddressScreen,
  [STEPS.ADD_CARD]: AddCardScreen,
};

const Step = componentFromProp('component');

const renderForm = ({
  canOffer,
  product,
  totalPrice,
  handleSubmit,
  booking,
  currentPrice,
  step,
  submitting,
  invalid,
  offerPrice,
  paymentMethod,
  paypalLoaded,
}) => (
  <div data-track-id={'checkoutForm'}>
    <form
      data-product-key={product.urlKey}
      onSubmit={handleSubmit(data => prepareData({
        ...data,
        totalPrice,
        paymentMethod,
      }, booking.submitBooking))}
    >
      <div styleName="product-container">
        <Field
          name="qty"
          component={ProductSnippet}
          product={product}
          canOffer={canOffer}
          price={canOffer ? offerPrice : currentPrice}
        />
      </div>
      {step === STEPS.MAIN &&
        <MainScreen
          submitting={submitting}
          invalid={invalid}
          paypalLoaded={paypalLoaded}
        />
      }
    </form>
    {stepMapping[step] && <Step component={stepMapping[step]} paypalLoaded={paypalLoaded} />}
  </div>
);

renderForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  product: PropTypes.shape({}).isRequired,
  booking: PropTypes.shape({}).isRequired,
  step: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  submitting: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  canOffer: PropTypes.bool,
  offerPrice: PropTypes.number,
  paymentMethod: PropTypes.shape({}),
  paypalLoaded: PropTypes.bool.isRequired,
};

renderForm.defaultProps = {
  canOffer: false,
  offerPrice: null,
  paymentMethod: null,
};

const mapStateToProps = state => ({
  product: state.booking.product,
  initialValues: {
    qty: state.booking.qty,
    customerAddress: addressSelectors.customerDeliveryAddress(state),
    productId: state.booking.product['@id'],
    paymentMethodId: cardsSelectors.defaultOrPreviousCardId(state),
    priceModelId: state.booking.product.priceModelId,
    bookingId: state.booking.id,
    canOffer: state.booking.canOffer,
    cancelOfferId: state.booking.cancelOfferId,
    price: bookingSelectors.price(state) || '',
    contactInfo: userSelectors.isUserPresented(state) ? undefined : '-1',
    fulfillment: bookingSelectors.fulfillment(state),
  },
  totalPrice: bookingSelectors.totalPrice(state),
  currentPrice: bookingSelectors.currentPrice(state),
  canOffer: state.booking.canOffer,
  startError: state.booking.error,
  step: bookingSelectors.lastScreenStep(state),
  offerPrice: bookingSelectors.offerPrice(state),
  paymentMethod: bookingSelectors.paymentMethod(state),
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
  bar: bindActionCreators(buyrBarActions, dispatch),
});

const ProductBookingForm = compose(
  connect(mapStateToProps, mapDispatchToProps),
  branch(
    R.propOr(false, 'startError'),
    renderComponent(StartError),
  ),
  branch(
    ({ step }) => R.isNil(step),
    renderComponent(BackBar),
  ),
  reduxForm({ form: 'product-booking', validate, destroyOnUnmount: false }),
  styled(styles),
)(renderForm);

export default formLoader(ProductBookingForm);
