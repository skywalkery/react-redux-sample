import React from 'react';
import { compose, withHandlers, onlyUpdateForKeys } from 'recompose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ContactForm from 'containers/BarContactGuest/ContactForm';
import { TextLink } from 'components';
import { bookingActions } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import { userActions } from 'ducks/user';
import styled from 'hocs/styled';
import styles from './addContactScreen.scss';

const AddContactScreen = ({ onSubmit, onSignInClick }) => (
  <div styleName="container">
    <ContactForm onSubmit={onSubmit} />
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
      user.signUpGuest({ ...data, formName: 'contactGuest' });
      return new Promise(() => {});
    },
    onSignInClick: ({ booking }) => () => booking.addStep(STEPS.SIGN_IN),
  }),
  onlyUpdateForKeys([]),
  styled(styles),
)(AddContactScreen);
