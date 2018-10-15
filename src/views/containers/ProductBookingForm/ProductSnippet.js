import React from 'react';
import { compose, withProps, withPropsOnChange } from 'recompose';
import { BarProductSnippet, OptionAttributes } from 'components';
import { CAN_MULTI_OFFER } from 'constants';

const ProductSnippet = ({ input: { onChange, value }, product, price, canOffer, oldPrice }) => (
  <BarProductSnippet
    qty={value}
    product={product}
    price={price}
    oldPrice={oldPrice}
    onChangeQty={!canOffer || CAN_MULTI_OFFER ? onChange : null}
    allowNilNewPrice={canOffer}
  >
    <OptionAttributes product={product} />
  </BarProductSnippet>
);

export default compose(
  withProps(({ product }) => ({
    msrp: product.msrp,
    productPrice: product.price,
  })),
  withPropsOnChange([
    'msrp', 'productPrice', 'price',
  ], ({ msrp, productPrice, price }) => ({
    oldPrice: Math.max(msrp || 0, productPrice || 0, price || 0),
  })),
)(ProductSnippet);
