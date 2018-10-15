import React from 'react';
import R from 'ramda';
import { compose, withProps, renderComponent, pure } from 'recompose';

import BookingSelect from './BookingSelect';
import withCreatorDataItem from './withCreatorDataItem';

const renderOption = ({ street, apartment, city, cleanZip, id }) => (
  <div>
    { id === '-1' ?
      <span>Add New Address</span> :
      <span>{R.join(', ', R.filter(R.complement(R.isNil),
        [street, apartment, city, cleanZip]))}
      </span>
    }
  </div>
);

export default compose(
  withProps(() => ({ renderOption })),
  renderComponent(withCreatorDataItem(BookingSelect)),
  pure,
)();
