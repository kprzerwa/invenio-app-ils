import React from 'react';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO, toISO } from '../../../../common/api/date';
import { ResultsList } from '../components';

Settings.defaultZoneName = 'utc';

describe('LoansSearch ResultsList tests', () => {
  const d = fromISO('2018-01-01T11:05:00+01:00');
  const start = d.plus({ days: 1 });
  const end = d.plus({ months: 1 });

  const results = [
    {
      id: 3,
      created: toISO(d),
      metadata: {
        state: 'ITEM_ON_LOAN',
        patron_pid: 1,
        start_date: toISO(start),
        end_date: toISO(end),
      },
    },
  ];

  let component;
  afterEach(() => {
    component.unmount();
  });

  it('should not render when empty results', () => {
    component = mount(
      <ResultsList results={[]} viewDetailsClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(
      <ResultsList results={results} viewDetailsClickHandler={() => {}} />
    );
    expect(component).toMatchSnapshot();
    const firstResult = results[0];
    const resultRows = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstResult.id);
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === 'State-' + firstResult.id
      );
    expect(mappedStatusElements).toHaveLength(1);

    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.state);
  });

  it('should call click handler on view details click', () => {
    const mockedClickHandler = jest.fn();
    component = mount(
      <ResultsList
        results={results}
        viewDetailsClickHandler={mockedClickHandler}
      />
    );
    const firstId = results[0].id;
    const button = component
      .find('TableRow')
      .filterWhere(element => element.prop('data-test') === firstId)
      .find('button');
    button.simulate('click');
    expect(mockedClickHandler).toHaveBeenCalledWith(firstId);
  });
});
