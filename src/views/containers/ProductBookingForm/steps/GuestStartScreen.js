import React from 'react';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { BarButton, TextLink, PaypalButton } from 'components';
import { bookingActions } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import { userActions } from 'ducks/user';
import styled from 'hocs/styled';
import PriceContainer from '../PriceContainer';
import styles from './guestStartScreen.scss';

const GuestStartScreen = ({
  onSignInClick,
  onCreateAccountClick,
  onCheckoutAsGuestClick,
  canOffer,
  onTokenize,
  paypalLoaded,
}) => (
  <div styleName="container">
    {canOffer &&
      <div styleName="price-wrapper">
        <PriceContainer canOffer={canOffer} />
      </div>
    }
    <BarButton
      trackId="bookingCreateAccountButton"
      onClick={onCreateAccountClick}
      type="button"
    >
      Create Account
    </BarButton>
    <div styleName="or-label">OR</div>
    <BarButton
      trackId="bookingCheckoutAsGuestButton"
      onClick={onCheckoutAsGuestClick}
      dark
      type="button"
    >
      Checkout as a Guest
    </BarButton>
    {paypalLoaded &&
      <div styleName="paypal-btn-container">
        <PaypalButton onTokenize={onTokenize} />
      </div>
    }
    <div styleName="have-acc-label">
      Already have an account?&nbsp;
      <TextLink
        data-track-id="bookingOpenSignInLink"
        text="Sign In"
        onClick={onSignInClick}
      />
    </div>
  </div>
);

const mapStateToProps = state => ({
  canOffer: state.booking.canOffer,
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
  user: bindActionCreators(userActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onSignInClick: ({ booking }) => () => booking.addStep(STEPS.SIGN_IN),
    onCreateAccountClick: ({ booking }) => () => booking.addStep(STEPS.CREATE_ACCOUNT),
    onCheckoutAsGuestClick: ({ booking }) => () => booking.addStep(STEPS.MAIN),
    onTokenize: ({ user }) => (payload) => {
      const { details } = payload;
      user.signUpGuestFromPaypal({
        first: details.firstName,
        last: details.lastName,
        email: details.email,
        nonce: payload.nonce,
        newAddress: payload.newAddress,
        formName: 'product-booking',
      });
    },
  }),
  onlyUpdateForKeys([]),
  styled(styles),
)(GuestStartScreen);
