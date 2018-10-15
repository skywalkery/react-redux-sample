import React from 'react';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SignUpForm from 'containers/BarSignUp/SignUpForm';
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

const CreateAccountScreen = ({
  onSubmit,
  onSignInClick,
  onGoogleSignIn,
  onFacebookSignIn,
}) => (
  <div styleName="container">
    <SignUpForm onSubmit={onSubmit} />
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
      Already have an account?&nbsp;
      <TextLink
        data-track-id="bookingOpenSignInLink"
        text="Sign In"
        onClick={onSignInClick}
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
      user.signUpEmailForOrder({ ...data, email: data.username, formName: 'signUp' });
      return new Promise(() => {});
    },
    onSignInClick: ({ booking }) => () => booking.addStep(STEPS.SIGN_IN),
    onGoogleSignIn: ({ user }) => data => user.signInGoogleForOrder({ ...data, formName: 'signUp' }),
    onFacebookSignIn: ({ user }) => data => user.signInFbForOrder({ ...data, formName: 'signUp' }),
  }),
  onlyUpdateForKeys([]),
  styled(styles),
)(CreateAccountScreen);
