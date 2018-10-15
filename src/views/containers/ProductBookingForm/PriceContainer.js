import React from 'react';
import { Field } from 'redux-form';
import { branch, renderComponent } from 'recompose';
import R from 'ramda';

import { BarInput } from 'components';
import styled from 'hocs/styled';
import PriceInput from './PriceInput';
import styles from './priceContainer.scss';

const ConstantPrice = () => (
  <Field name="price" component="input" type="hidden" />
);

const PriceContainer = () => (
  <div styleName="price-container">
    <BarInput
      trackId="bookingOfferPriceInput"
      name="price"
      label="Your Offer Price"
      type={BarInput.types.TYPE_PRICE}
      component={PriceInput}
      required
    />
  </div>
);

const PriceContainerCond = branch(
  R.propOr(false, 'canOffer'),
  renderComponent(styled(styles)(PriceContainer)),
  renderComponent(ConstantPrice),
)();

export default PriceContainerCond;
