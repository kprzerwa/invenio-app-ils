import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Error } from '../../../../../common/components';
import { loan as loanApi } from '../../../../../common/api/';
import './PatronLoans.scss';

import { ResultsTable } from '../../../../../common/components';
import {
  loanSearchQueryUrl,
  viewLoanDetailsUrl,
} from '../../../../../common/urls';
import { Button } from 'semantic-ui-react';
import { formatter } from '../../../../../common/components/ResultsTable/formatters';

export default class PatronLoans extends Component {
  constructor(props) {
    super(props);
    this.fetchPatronLoans = props.fetchPatronLoans;
    this.showDetailsUrl = viewLoanDetailsUrl;
    this.showAllUrl = loanSearchQueryUrl;
  }

  componentDidMount() {
    const patron_pid = this.props.patron ? this.props.patron : null;
    this.fetchPatronLoans(patron_pid);
  }

  _showDetailsHandler = loan_pid =>
    this.props.history.push(this.showDetailsUrl(loan_pid));

  _showAllButton = () => {
    const { patron } = this.props;
    const _click = () =>
      this.props.history.push(
        this.showAllUrl(
          loanApi
            .query()
            .withPatronPid(patron)
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
    return this.props.data.map(row => {
      let tableRow = formatter.loan.toTable(row);
      delete tableRow['Patron ID'];
      return tableRow;
    });
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
            name={"User's loan requests"}
            actionClickHandler={this._showDetailsHandler}
            showAllButton={this._showAllButton()}
            showMaxRows={this.props.showMaxLoans}
          />
        </Error>
      </Loader>
    );
  }
}

PatronLoans.propTypes = {
  patron: PropTypes.number,
  fetchPatronLoans: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  showMaxLoans: PropTypes.number,
};

PatronLoans.defaultProps = {
  showMaxLoans: 5,
};
