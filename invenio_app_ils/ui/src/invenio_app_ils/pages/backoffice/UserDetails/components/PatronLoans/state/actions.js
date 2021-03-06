import {
  IS_LOADING,
  SUCCESS,
  HAS_ERROR,
  CHANGE_SORT_BY,
  CHANGE_SORT_ORDER,
} from './types';
import { loan as loanApi } from '../../../../../../common/api';

export const fetchPatronLoans = patronPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    await loanApi
      .list(
        loanApi
          .query()
          .withPatronPid(patronPid)
          .qs()
      )
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: HAS_ERROR,
          payload: error,
        });
      });
  };
};

export const patronLoansChangeSortBy = (
  documentPid,
  itemPid,
  loanState,
  patronPid
) => {
  return async (dispatch, getState) => {
    const newSortBy =
      getState().patronLoans.sortBy === 'transaction_date'
        ? 'start_date'
        : 'transaction_date';

    dispatch({
      type: CHANGE_SORT_BY,
      payload: newSortBy,
    });

    await dispatch(
      fetchPatronLoans(documentPid, itemPid, loanState, patronPid)
    );
  };
};

export const patronLoansChangeSortOrder = (
  documentPid,
  itemPid,
  loanState,
  patronPid
) => {
  return async (dispatch, getState) => {
    const newSortOrder =
      getState().patronLoans.sortOrder === 'asc' ? 'desc' : 'asc';

    dispatch({
      type: CHANGE_SORT_ORDER,
      payload: newSortOrder,
    });

    await dispatch(
      fetchPatronLoans(documentPid, itemPid, loanState, patronPid)
    );
  };
};
