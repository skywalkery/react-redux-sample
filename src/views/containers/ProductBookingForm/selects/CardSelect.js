import React from 'react';
import R from 'ramda';
import { compose, withProps, renderComponent, pure } from 'recompose';

import styled from 'hocs/styled';
import VisaIcon from 'icons/payment/visa.svg';
import AmexIcon from 'icons/payment/amex.svg';
import DinersIcon from 'icons/payment/diners.svg';
import DiscoverIcon from 'icons/payment/discover.svg';
import JCBIcon from 'icons/payment/jcb.svg';
import MasterCardIcon from 'icons/payment/mastercard.svg';
import PaypalIcon from 'icons/payment/paypal.svg';
import BookingSelect from './BookingSelect';
import withCreatorDataItem from './withCreatorDataItem';
import styles from './cardSelect.scss';

const StyledIcon = (Icon, styleName = 'card-icon') => styled(styles)(() => (
  <Icon styleName={styleName} />
));
const Visa = StyledIcon(VisaIcon);
const Amex = StyledIcon(AmexIcon);
const MasterCard = StyledIcon(MasterCardIcon);
const Discover = StyledIcon(DiscoverIcon);
const JCB = StyledIcon(JCBIcon);
const Diners = StyledIcon(DinersIcon);
const Paypal = StyledIcon(PaypalIcon, 'paypal-icon');

const renderPaymentLabel = card => (
  <span>
    {R.cond([
      [c => R.complement(R.isNil)(c.last4), R.always(`XXXX-XXXX-XXXX-${card.last4}`)],
      [c => R.complement(R.isNil)(c.email), R.always(card.email)],
      [R.T, R.always('')],
    ])(card)}
  </span>
);

const renderOption = card => (
  <div className={styles.option}>{R.cond([
    [R.equals('Visa'), R.always(<Visa />)],
    [R.equals('American Express'), R.always(<Amex />)],
    [R.equals('MasterCard'), R.always(<MasterCard />)],
    [R.equals('Discover'), R.always(<Discover />)],
    [R.equals('JCB'), R.always(<JCB />)],
    [R.equals('Diners Club'), R.always(<Diners />)],
    [R.equals('Paypal'), R.always(<Paypal />)],
    [R.T, R.always('')],
  ])(card.brand)}
    { card.id === '-1' ?
      <span>Add New Card</span> :
      renderPaymentLabel(card)
    }
  </div>
);

export default compose(
  withProps(() => ({ renderOption })),
  renderComponent(withCreatorDataItem(BookingSelect)),
  pure,
)();
