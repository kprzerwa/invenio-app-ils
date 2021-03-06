import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';

export class SearchBar extends Component {
  render() {
    const {
      currentQueryString,
      onInputChange,
      executeSearch,
      placeholder,
    } = this.props;
    return (
      <Input
        action={{
          content: 'Search',
          onClick: () => {
            executeSearch();
          },
        }}
        fluid
        placeholder={placeholder}
        onChange={(e, { value }) => {
          onInputChange(value);
        }}
        value={currentQueryString}
        onKeyPress={event => {
          if (event.key === 'Enter') {
            executeSearch();
          }
        }}
      />
    );
  }
}

SearchBar.propTypes = {
  currentQueryString: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  executeSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};
