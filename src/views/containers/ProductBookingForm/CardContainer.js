import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, getFormSyncErrors, getFormMeta } from 'redux-form';
import { compose, withHandlers, pure, withProps } from 'recompose';

import { LabelWithTip, PaypalButton } from 'components';
import { bookingActions } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import getError from 'helpers/getFormError';
import styled from 'hocs/styled';
import CardSelect from './selects/CardSelect';
import styles from './cardContainer.scss';

const formName = 'product-booking';

const CardContainer = ({
  cards,
  onOpenNewForm,
  disabled,
  onTokenize,
  paypalLoaded,
  error,
}) => (
  <div data-track-id="bookingSelectPaymentMethod" styleName="card-container">
    <LabelWithTip tip="How would you like to pay?">
      Payment Method
    </LabelWithTip>
    <Field
      name="paymentMethodId"
      component={CardSelect}
      data={cards}
      onOpenNewForm={onOpenNewForm}
      disabled={disabled}
    />
    {error &&
      <div styleName="error">
        { error }
      </div>
    }
    {paypalLoaded &&
      <div styleName="paypal-btn-container">
        <PaypalButton onTokenize={onTokenize} />
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  formSyncErrors: getFormSyncErrors(formName)(state),
  formMeta: getFormMeta(formName)(state),
  bookingId: state.booking.id,
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ formSyncErrors, formMeta }) => ({
    error: getError(formSyncErrors, formMeta)('paymentMethodId'),
  })),
  withHandlers({
    onOpenNewForm: ({ booking }) => () => {
      booking.addStep(STEPS.ADD_CARD);
    },
    onTokenize: ({ booking, bookingId }) => (payload) => {
      booking.addPaypal({
        nonce: payload.nonce,
        email: payload.details.email,
        newAddress: payload.newAddress,
        bookingId,
      });
    },
  }),
  pure,
  styled(styles),
)(CardContainer);
