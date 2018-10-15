import React from 'react';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SignInForm from 'containers/BarSignIn/SignInForm';
import {
  TextLink,
  BarButtonFacebook,
  BarButtonGoogle,
} from 'components';
import { bookingActions } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import { userActions } from 'ducks/user';
import styled from 'hocs/styled';
import styles from './createAccountScreen.scss';

const SignInScreen = ({
  onSubmit,
  onSignUpClick,
  onGoogleSignIn,
  onFacebookSignIn,
}) => (
  <div styleName="container">
    <SignInForm onSubmit={onSubmit} />
    <div styleName="or-label">OR</div>
    <div styleName="social-btns">
      <BarButtonGoogle
        title="Sign In with Google"
        onSuccess={onGoogleSignIn}
      />
      <BarButtonFacebook
        title="Sign In with Facebook"
        onSuccess={onFacebookSignIn}
      />
    </div>
    <div styleName="have-acc-label">
      Are you a new customer?&nbsp;
      <TextLink
        data-track-id="bookingOpenSignUpLink"
        text="Create an account!"
        onClick={onSignUpClick}
      />
    </div>
  </div>
);

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
  user: bindActionCreators(userActions, dispatch),
});

export default compose(
  connect(null, mapDispatchToProps),
  withHandlers({
    onSubmit: ({ user }) => (data) => {
      user.signInEmailForOrder({ ...data, email: data.username, formName: 'signIn' });
      return new Promise(() => {});
    },
    onSignUpClick: ({ booking }) => () => booking.addStep(STEPS.CREATE_ACCOUNT),
    onGoogleSignIn: ({ user }) => data => user.signInGoogleForOrder({ ...data, formName: 'signIn' }),
    onFacebookSignIn: ({ user }) => data => user.signInFbForOrder({ ...data, formName: 'signIn' }),
  }),
  onlyUpdateForKeys([]),
  styled(styles),
)(SignInScreen);
