import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { UserMetadata, PatronLoans } from '../';

export default class UserDetails extends Component {
  render() {
    const { isLoading, hasError, data } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <UserMetadata />
          <PatronLoans patron={data.user_pid} />
        </Error>
      </Loader>
    );
  }
}

UserDetails.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.object,
  hasError: PropTypes.bool.isRequired,
};
