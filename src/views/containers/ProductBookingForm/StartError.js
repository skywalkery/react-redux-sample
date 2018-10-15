import React from 'react';
import { compose, onlyUpdateForKeys } from 'recompose';

import styled from 'hocs/styled';
import styles from './startError.scss';

const StartError = ({ startError }) => (
  <div styleName="content">
    <div styleName="server-error">{startError}</div>
  </div>
);

export default compose(
  styled(styles),
  onlyUpdateForKeys(['startError']),
)(StartError);
