import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import scriptLoader from 'react-async-script-loader';

import { PAYPAL_CHECKOUT_JS_URL } from 'env';
import styled from 'hocs/styled';
import styles from './styles.scss';

import StartError from './StartError';

const renderWrapper = FormEl => ({ isScriptLoadSucceed, dataLoaded, error }) => (
  <div styleName="content">
    {dataLoaded && <FormEl paypalLoaded={isScriptLoadSucceed} />}
    {!dataLoaded && error && <StartError startError={error} />}
  </div>
);

const mapStateToWrapperProps = state => ({
  dataLoaded: state.booking.dataLoaded,
  error: state.booking.error,
});

export default formEl => compose(
  connect(mapStateToWrapperProps),
  scriptLoader(PAYPAL_CHECKOUT_JS_URL),
  styled(styles),
)(renderWrapper(formEl));
