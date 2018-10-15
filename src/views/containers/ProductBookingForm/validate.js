import Decimal from 'decimal.js';

const validate = (values, props) => {
  const errors = {};
  if (values.contactInfo === '-1') {
    errors.contactInfo = 'Please add your contact info';
  }
  if (values.customerAddress === '-9999') {
    errors.customerAddress = 'Please select your address';
  }
  if (values.customerAddress === '-1') {
    errors.customerAddress = 'Please add your address first';
  }
  if (values.paymentMethodId === '-1') {
    errors.paymentMethodId = 'Please add your card first';
  }
  if (props.canOffer && !values.price) {
    errors.price = 'Price is required';
  }
  if (props.canOffer && values.price) {
    const cleanPrice = `${values.price},`.replace(/,/g, '').replace(/\$/g, '');
    if (new Decimal(cleanPrice).greaterThan(new Decimal(props.currentPrice))) {
      errors.price = 'Offer price should be less than current price';
    } else if (new Decimal(cleanPrice).lessThan(new Decimal(1))) {
      errors.price = 'Minimal offer price - $1.00';
    }
  }
  return errors;
};

export default validate;
