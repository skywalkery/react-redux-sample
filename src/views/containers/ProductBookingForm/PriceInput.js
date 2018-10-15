import React from 'react';
import { compose, withHandlers } from 'recompose';

import { trackPageview } from 'helpers/gtm';
import styled from 'hocs/styled';
import styles from './styles.scss';

const PriceInput = ({
  input,
  placeholder,
  disabled,
  meta: { active, touched, error },
  onBlur,
}) => (
  <div styleName="price-input-container">
    <input
      {...input}
      placeholder={placeholder}
      type="number"
      disabled={disabled}
      styleName={touched && error && !active ? 'input-price-error' : 'input-price'}
      min="0"
      step="0.01"
      onBlur={onBlur}
    />
    <span styleName={input.value || active ? 'dollar' : 'dollar-inactive'}>$</span>
    {touched && error && !active && <p>{error}</p>}
  </div>
);

export default compose(
  withHandlers({
    onBlur: ({ input: { onBlur } }) => (e) => {
      const value = e.target.value;
      if (value) {
        const formatted = Number(value).toFixed(2);
        onBlur(formatted);
        trackPageview('/booking/offerPrice', 'Offer price added');
      } else {
        onBlur(value);
      }
    },
  }),
  styled(styles),
)(PriceInput);
