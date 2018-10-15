import React from 'react';
import { compose, withProps, renderComponent, pure } from 'recompose';

import BookingSelect from './BookingSelect';
import withCreatorDataItem from './withCreatorDataItem';

const renderOption = ({ id, label }) => (
  <div>
    { id === '-1' ?
      <span>Add New Contact</span> :
      <span>{label}</span>
    }
  </div>
);

export default compose(
  withProps(() => ({ renderOption })),
  renderComponent(withCreatorDataItem(BookingSelect)),
  pure,
)();
