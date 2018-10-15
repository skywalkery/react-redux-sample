import React from 'react';
import Select from 'react-select';
import { compose, withHandlers, pure } from 'recompose';
import 'react-select/dist/react-select.css';

const renderOption = ({ label }) => (
  <span>{label}</span>
);

const SimpleSelect = ({ input: { onBlur, value }, data, onChange }) => (
  <Select
    onChange={onChange}
    onBlur={onBlur}
    value={value}
    valueKey="value"
    valueRenderer={renderOption}
    options={data}
    optionRenderer={renderOption}
    clearable={false}
    searchable={false}
    deleteRemoves={false}
    backspaceRemoves={false}
  />
);

export default compose(
  withHandlers({
    onChange: ({ input: { onChange } }) => item => onChange(item.value),
  }),
  pure,
)(SimpleSelect);
