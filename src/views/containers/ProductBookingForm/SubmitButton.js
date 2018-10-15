import React from 'react';
import CSSModules from 'react-css-modules';
import { BarButton } from 'components';
import R from 'ramda';
import { branch, renderComponent } from 'recompose';

import numberWithCommas from 'helpers/numberWithCommas';
import Offer from 'icons/offer.svg';
import BuyNow from 'icons/buy-now.svg';
import styles from './styles.scss';

const styled = c => CSSModules(c, styles);

const MakeOfferButton = ({ disabled, updateOffer, price }) => (
  <BarButton
    type="submit"
    disabled={disabled}
    trackId="bookingSubmitOffer"
  >
    <Offer styleName="offer-icon" />
    {updateOffer ? 'Update Offer' : `Submit ${price ? `$${numberWithCommas(price)} ` : ''}Offer`}
  </BarButton>
);

const MakeOrderButton = ({ disabled }) => (
  <BarButton
    type="submit"
    secondary
    disabled={disabled}
    trackId="bookingSubmitOrder"
  >
    <BuyNow styleName="buy-now-icon" />
    <span>Buy Now</span>
  </BarButton>
);

const SubmitButton = branch(
  R.propOr(false, 'canOffer'),
  renderComponent(styled(MakeOfferButton)),
  renderComponent(styled(MakeOrderButton)),
)();

export default SubmitButton;
