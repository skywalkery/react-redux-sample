import React from 'react';
import PropTypes from 'prop-types';
import { compose, pure } from 'recompose';
import { connect } from 'react-redux';
import { formValueSelector, getFormError } from 'redux-form';

import { SecurityBadges } from 'components';
import { addressSelectors } from 'ducks/addresses';
import { userSelectors } from 'ducks/user';
import { bookingSelectors } from 'ducks/booking';
import numberWithCommas from 'helpers/numberWithCommas';
import styled from 'hocs/styled';
import PriceContainer from '../PriceContainer';
import SubmitButton from '../SubmitButton';
import CardContainer from '../CardContainer';
import AddressContainer from '../AddressContainer';
import ContactContainer from '../ContactContainer';
import styles from './mainScreen.scss';

const MainScreen = ({
  cancelOfferId,
  qty,
  cards,
  addresses,
  submitting,
  isUserPresented,
  fulfillmentOptions,
  canOffer,
  totalPrice,
  error,
  paypalLoaded,
  invalid,
}) => (
  <div>
    <PriceContainer canOffer={canOffer} />
    <ContactContainer isUserPresented={isUserPresented} />
    <AddressContainer
      addresses={addresses}
      fulfillmentOptions={fulfillmentOptions}
      disabled={!isUserPresented}
    />
    <CardContainer
      cards={cards}
      disabled={!isUserPresented}
      paypalLoaded={paypalLoaded}
    />
    <div styleName="submit-container">
      <div styleName="total-container">
        <span>Total: {qty} item{qty > 1 && 's'}</span>
        <span>${numberWithCommas(totalPrice)}</span>
      </div>
      {error &&
        <div styleName="error">
          { error }
        </div>
      }
      <SubmitButton
        canOffer={canOffer}
        disabled={submitting || invalid}
        updateOffer={cancelOfferId}
        price={canOffer ? totalPrice : 0}
      />
      {canOffer && <span styleName="offer-explain">You may cancel your offer at any time. A pending charge may appear on your payment account. Due to the great deals, all orders are final.</span>}
      {!canOffer && <span styleName="offer-explain">You’re agreeing to the final price, and that’s it! Ground shipping and tax included. Due to the steep discounts, all orders are final.</span>}
      <SecurityBadges />
    </div>
  </div>
);

MainScreen.propTypes = {
  qty: PropTypes.number.isRequired,
  cards: PropTypes.arrayOf(PropTypes.object),
  addresses: PropTypes.arrayOf(PropTypes.object),
  submitting: PropTypes.bool,
  invalid: PropTypes.bool,
  cancelOfferId: PropTypes.number,
  isUserPresented: PropTypes.bool.isRequired,
  totalPrice: PropTypes.number.isRequired,
  fulfillmentOptions: PropTypes.arrayOf(PropTypes.object),
  canOffer: PropTypes.bool,
  error: PropTypes.string,
  paypalLoaded: PropTypes.bool.isRequired,
};

MainScreen.defaultProps = {
  addresses: [],
  cards: [],
  canOffer: false,
  submitting: false,
  invalid: false,
  cancelOfferId: null,
  fulfillmentOptions: [],
  error: null,
};

const formSelector = formValueSelector('product-booking');
const mapStateToProps = state => ({
  cancelOfferId: state.booking.cancelOfferId,
  qty: formSelector(state, 'qty') || state.booking.qty,
  cards: bookingSelectors.paymentMethods(state),
  addresses: addressSelectors.addressList(state),
  isUserPresented: userSelectors.isUserPresented(state),
  fulfillmentOptions: bookingSelectors.fulfillmentOptions(state),
  canOffer: state.booking.canOffer,
  totalPrice: bookingSelectors.totalPrice(state),
  error: getFormError('product-booking')(state),
});

export default compose(
  connect(mapStateToProps),
  pure,
  styled(styles),
)(MainScreen);
