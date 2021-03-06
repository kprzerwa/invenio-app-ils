import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { ResultsTable } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api';

import {
  loanSearchQueryUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';
import { Button } from 'semantic-ui-react';

export default class DocumentPendingLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPendingLoans = props.fetchPendingLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    const { document_pid } = this.props.document;
    this.fetchPendingLoans(document_pid);
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _showAllButton = () => {
    const { document_pid } = this.props.document;

    const _click = () =>
      this.props.history.push(
        this.showAllUrl(
          loanApi
            .query()
            .withDocPid(document_pid)
            .withState('PENDING')
            .qs()
        )
      );

    return (
      <Button
        size="small"
        onClick={() => {
          _click();
        }}
      >
        Show all
      </Button>
    );
  };

  prepareData() {
    return this.props.data.map(row => formatter.loan.toTable(row));
  }

  render() {
    const rows = this.prepareData();
    const { data, isLoading, hasError } = this.props;
    const errorData = hasError ? data : null;
    return (
      <Loader isLoading={isLoading}>
        <Error error={errorData}>
          <ResultsTable
            rows={rows}
            name={'Pending loans requests'}
            actionClickHandler={this._showDetailsHandler}
            showAllButton={this._showAllButton()}
            showMaxRows={this.props.showMaxPendingLoans}
          />
        </Error>
      </Loader>
    );
  }
}

DocumentPendingLoans.propTypes = {
  document: PropTypes.object.isRequired,
  fetchPendingLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxPendingLoans: PropTypes.number,
};

DocumentPendingLoans.defaultProps = {
  showMaxPendingLoans: 5,
};
