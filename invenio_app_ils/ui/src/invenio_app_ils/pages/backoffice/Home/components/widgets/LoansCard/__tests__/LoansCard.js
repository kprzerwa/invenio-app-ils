import React from 'react';
import { shallow, mount } from 'enzyme';
import { Settings } from 'luxon';
import { fromISO } from '../../../../../../../common/api/date';
import LoansCard from '../LoansCard';

Settings.defaultZoneName = 'utc';
const d = fromISO('2018-01-01T11:05:00+01:00');

describe('LoansCard tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should load the details component', () => {
    const mockedFetchLoans = jest.fn();

    const component = shallow(
      <LoansCard
        history={() => {}}
        data={0}
        fetchPendingLoans={mockedFetchLoans}
      />
    );
    expect(component).toMatchSnapshot();
  });

  it('should render stats with 2 records', () => {
    const mockedFetchLoans = jest.fn();
    const data = 2;

    component = mount(
      <LoansCard
        history={() => {}}
        data={data}
        fetchPendingLoans={mockedFetchLoans}
      />
    );

    expect(component).toMatchSnapshot();
    const stats = component.find('span').prop('data-test');
    expect(stats).toEqual(data);
  });
});
