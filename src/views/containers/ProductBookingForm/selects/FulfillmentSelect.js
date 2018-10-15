import React from 'react';
import R from 'ramda';
import { compose, withProps, renderComponent } from 'recompose';
import BookingSelect from './BookingSelect';
import styles from './fulfillmentSelect.scss';

const renderOption = ({ label: { name, cost } }) => (
  <div className={styles.option}>
    <span>{name}</span>
    {R.complement(R.isNil)(cost) && cost > 0 && <span className={styles.cost}>${cost}</span>}
  </div>
);

export default compose(
  withProps(() => ({ renderOption })),
  renderComponent(BookingSelect),
)();
