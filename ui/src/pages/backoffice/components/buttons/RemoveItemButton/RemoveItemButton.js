import React, { Component } from 'react';
import { Button, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class RemoveItemButton extends Component {
  render() {
    const button = (
      <Button
        icon="close"
        size="mini"
        attached="left"
        negative
        onClick={this.props.onClick}
        className="bo-remove-item"
        dataPid={this.props.dataPid}
      />
    );

    if (this.props.popup) {
      return <Popup content={this.props.popup} trigger={button} />;
    }
    return button;
  }
}

RemoveItemButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  popup: PropTypes.string,
};
