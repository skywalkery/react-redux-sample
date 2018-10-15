import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, getFormSyncErrors, getFormMeta } from 'redux-form';
import { compose, withHandlers, pure, withProps } from 'recompose';

import { LabelWithTip } from 'components';
import { bookingActions } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import getError from 'helpers/getFormError';
import styled from 'hocs/styled';
import AddressSelect from './selects/AddressSelect';
import FulfillmentSelect from './selects/FulfillmentSelect';
import styles from './addressContainer.scss';

const AddressContainer = ({
  addresses,
  onOpenNewForm,
  fulfillmentOptions,
  disabled,
  error,
}) => (
  <div styleName="address-container">
    <div data-track-id="bookingSelectFulfillmentType" styleName="delivery">
      <LabelWithTip tip="How fast do you want to receive it?">
        Fulfillment Type
      </LabelWithTip>
      <Field
        name="fulfillment"
        component={FulfillmentSelect}
        data={fulfillmentOptions}
        disabled={disabled}
      />
    </div>
    <div data-track-id="bookingSelectDeliveryAddress" styleName="address">
      <LabelWithTip tip="Where do you want it delivered?">
        Delivery Address
      </LabelWithTip>
      <Field
        name="customerAddress"
        component={AddressSelect}
        data={addresses}
        onOpenNewForm={onOpenNewForm}
        disabled={disabled}
      />
    </div>
    {error &&
      <div styleName="error">
        { error }
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  formSyncErrors: getFormSyncErrors('product-booking')(state),
  formMeta: getFormMeta('product-booking')(state),
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ formSyncErrors, formMeta }) => ({
    error: getError(formSyncErrors, formMeta)('customerAddress'),
  })),
  withHandlers({
    onOpenNewForm: ({ booking }) => () => {
      booking.addStep(STEPS.ADD_ADDRESS);
    },
  }),
  pure,
  styled(styles),
)(AddressContainer);
