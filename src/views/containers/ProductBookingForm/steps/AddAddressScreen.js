import React from 'react';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AddressForm from 'containers/BarAddress/AddressForm';
import { bookingActions } from 'ducks/booking';
import styled from 'hocs/styled';
import styles from './addAddressScreen.scss';

const AddAddressScreen = ({ onSubmit }) => (
  <div styleName="container">
    <AddressForm onSubmit={onSubmit} />
  </div>
);

const mapStateToProps = state => ({
  bookingId: state.booking.id,
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withHandlers({
    onSubmit: ({ booking, bookingId }) => (data) => {
      booking.addAddress({ ...data, bookingId, formName: 'address' });
      return new Promise(() => {});
    },
  }),
  onlyUpdateForKeys([]),
  styled(styles),
)(AddAddressScreen);
