import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Field, getFormSyncErrors, getFormMeta } from 'redux-form';
import { compose, withHandlers, pure, withProps } from 'recompose';

import { LabelWithTip } from 'components';
import { bookingActions } from 'ducks/booking';
import { STEPS } from 'ducks/booking/constants';
import { destroyGuestContactForm } from 'ducks/user/actions';
import getError from 'helpers/getFormError';
import styled from 'hocs/styled';
import ContactSelect from './selects/ContactSelect';
import styles from './contactContainer.scss';

const formName = 'product-booking';

const contacts = [];

const ContactContainer = ({
  onOpenNewForm,
  error,
  isUserPresented,
  user,
}) => (
  <div data-track-id="bookingOpenContactInfo" styleName="contact-container">
    <LabelWithTip tip="Who’s this for?">
      Contact Info
    </LabelWithTip>
    {!isUserPresented &&
      <Field
        name="contactInfo"
        component={ContactSelect}
        data={contacts}
        onOpenNewForm={onOpenNewForm}
      />
    }
    {!isUserPresented && error &&
      <div styleName="error">
        { error }
      </div>
    }
    {isUserPresented &&
      <div styleName="contant-info">
        {user.first ? user.first : ''}
        {user.last ? ` ${user.last}` : ''}
        {user.first || user.last ? ', ' : ''}
        {user.email}
      </div>
    }
  </div>
);

const mapStateToProps = state => ({
  bookingId: state.booking.id,
  formSyncErrors: getFormSyncErrors(formName)(state),
  formMeta: getFormMeta(formName)(state),
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  booking: bindActionCreators(bookingActions, dispatch),
  destroyForm: bindActionCreators(destroyGuestContactForm, dispatch),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withProps(({ formSyncErrors, formMeta }) => ({
    error: getError(formSyncErrors, formMeta)('contactInfo'),
  })),
  withHandlers({
    openAddContactForm: ({ booking }) => () => booking.addStep(STEPS.ADD_CONTACT),
  }),
  withHandlers({
    onOpenNewForm: ({ openAddContactForm, destroyForm }) => () => {
      destroyForm();
      openAddContactForm();
    },
  }),
  pure,
  styled(styles),
)(ContactContainer);
