import React from 'react';

import { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Segment,
  Container,
  Header,
  Button,
  Table,
  Icon,
} from 'semantic-ui-react';
import { CreateNewLoanModal } from './components/CreateNewLoanModal';
import { invenioConfig } from '../../../../../common/config';

import './ItemMetadata.scss';

export default class ItemMetadata extends Component {
  render() {
    const { item } = this.props;
    return (
      <Segment className="item-metadata">
        <Grid padded columns={2}>
          <Grid.Column width={16}>
            <Header as="h1">
              Item - {item.barcode}
              <Button
                primary
                floated="right"
                size="small"
                onClick={() =>
                  window.open(
                    `${invenioConfig.editor.url}url=${item.links.self}`,
                    item.links.self
                  )
                }
              >
                <Icon name="edit" />
                edit
              </Button>
              <CreateNewLoanModal
                itemPid={item.item_pid}
                active={
                  !invenioConfig.circulation.loanActiveStates.includes(
                    item.circulation_status
                  )
                }
                onLoanCreatedCallback={this.props.fetchItemDetails}
              />
            </Header>
          </Grid.Column>

          <Grid.Column>
            <Table basic="very" definition className="metadata-table">
              <Table.Body>
                <Table.Row>
                  <Table.Cell width={4}>Circulation Status</Table.Cell>
                  <Table.Cell width={12}>{item.circulation_status}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell width={4}>Item Status</Table.Cell>
                  <Table.Cell width={12}>{item.status}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Barcode</Table.Cell>
                  <Table.Cell>{item.barcode}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Medium</Table.Cell>
                  <Table.Cell>{item.medium}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Circulation Restriction</Table.Cell>
                  <Table.Cell>{item.circulation_restriction}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Shelf</Table.Cell>
                  <Table.Cell>{item.shelf}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Legacy ID</Table.Cell>
                  <Table.Cell>{item.legacy_id}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Document</Table.Cell>
                  <Table.Cell>{item.document_pid}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Library</Table.Cell>
                  <Table.Cell>{item.location}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Location</Table.Cell>
                  <Table.Cell>{item.internal_location.name}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Column>

          <Grid.Column>
            <Container>
              <Header as="h4">Description</Header>
              <p>{item.description}</p>
            </Container>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

ItemMetadata.propTypes = {
  item: PropTypes.object.isRequired,
};
