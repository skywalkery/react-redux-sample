import React from 'react';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { NewCardForm } from 'containers';
import { bookingActions, bookingSelectors } from 'ducks/booking';
import styled from 'hocs/styled';
import styles from './addCardScreen.scss';

const AddCardScreen = ({ onSubmit, billingAddress }) => (
  <div styleName="container">
    <NewCardForm onTokenCreated={onSubmit} billingAddress={billingAddress} />
  </div>
);

const mapStateToProps = state => ({
  billingAddress: bookingSelectors.shippingAddress(state),
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onSubmit: ({ booking }) => (data) => {
      booking.addCard(data);
      return new Promise(() => {});
    },
  }),
  onlyUpdateForKeys([]),
  styled(styles),
)(AddCardScreen);
