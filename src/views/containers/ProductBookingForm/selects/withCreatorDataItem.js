import { compose, withPropsOnChange } from 'recompose';

export default compose(
  withPropsOnChange(
    ['data'],
    ({ data }) => ({ data: [...data, { id: '-1' }] }),
  ),
);
