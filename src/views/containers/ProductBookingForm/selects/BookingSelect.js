import React from 'react';
import Select from 'react-select';
import { compose, withHandlers, pure } from 'recompose';
import 'react-select/dist/react-select.css';

import styles from './bookingSelect.scss';

const renderArrow = ({ onMouseDown, isSingleOption }) => (
  <span
    role="presentation"
    className={isSingleOption ? 'Select-arrow-rotate' : 'Select-arrow'}
    onMouseDown={onMouseDown}
  />
);

const BookingSelect = ({
  input: { onBlur, value },
  data,
  onChange,
  arrowRenderer,
  onOpen,
  renderOption,
  disabled,
}) => (
  <Select
    className={styles.select}
    arrowRenderer={arrowRenderer}
    onChange={onChange}
    onBlur={onBlur}
    onOpen={onOpen}
    value={value}
    valueKey="id"
    valueRenderer={renderOption}
    options={data}
    optionRenderer={renderOption}
    clearable={false}
    searchable={false}
    deleteRemoves={false}
    backspaceRemoves={false}
    disabled={disabled}
  />
);

export default compose(
  withHandlers({
    onChange: ({ input: { onChange }, onOpenNewForm }) => (item) => {
      if (item.id === '-1') {
        onOpenNewForm();
      } else {
        onChange(item.id);
      }
    },
    arrowRenderer: ({ data }) => ({ onMouseDown }) =>
      renderArrow({ onMouseDown, isSingleOption: data.length === 1 }),
    onOpen: ({ data, onOpenNewForm }) => () => {
      if (data.length === 1 && data[0].id === '-1') {
        onOpenNewForm();
      }
    },
  }),
  pure,
)(BookingSelect);
