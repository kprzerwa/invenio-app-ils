# -*- coding: utf-8 -*-
#
# Copyright (C) 2018-2020 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Test loans list permissions."""

import json

import pytest
from flask import url_for
from invenio_circulation.search.api import LoansSearch
from tests.helpers import user_login

from invenio_app_ils.errors import UnauthorizedSearchError
from invenio_app_ils.search.permissions import search_factory_filter_by_patron


def _search_loans(client, json_headers, **kwargs):
    """Return the loan fetched with a REST call."""
    url = url_for("invenio_records_rest.loanid_list", **kwargs)
    return client.get(url, headers=json_headers)


def test_anonymous_cannot_search_any_loan(client, json_headers, users):
    """Test that anonymous cannot search any loan in search results."""
    res = _search_loans(client, json_headers)
    assert res.status_code == 401


def test_admin_or_librarian_can_search_any_loan(
    client, json_headers, users, testdata
):
    """Test that admins and librarians can search any loan."""
    for username in ["admin", "librarian"]:
        user_login(client, username, users)
        res = _search_loans(client, json_headers)
        assert res.status_code == 200
        hits = json.loads(res.data.decode("utf-8"))
        assert len(hits["hits"]["hits"]) == len(testdata["loans"])


def test_anonymous_loans_search(app):
    """Test that not logged in users are unable to search."""
    with app.test_request_context("/"):
        with pytest.raises(UnauthorizedSearchError):
            search_factory_filter_by_patron(None, LoansSearch())


def test_patrons_can_search_their_own_loans(
    client, json_headers, users, testdata
):
    """Test that patrons can search their own loans."""

    def _validate_only_patron_loans(res, user, state):
        """Assert that result loans belong to the given user only."""
        patron_loans = [
            l
            for l in testdata["loans"]
            if l["patron_pid"] == str(user.id) and l["state"] == state
        ]

        assert res.status_code == 200
        hits = json.loads(res.data.decode("utf-8"))
        assert hits["hits"]["total"] == len(patron_loans)
        for hit in hits["hits"]["hits"]:
            assert hit["metadata"]["patron_pid"] == str(user.id)

    state = "PENDING"
    for username in ["patron1", "patron2"]:
        user = user_login(client, username, users)
        # search with no params
        res = _search_loans(client, json_headers, state=state)
        _validate_only_patron_loans(res, user, state)

        # search with params
        res = _search_loans(
            client,
            json_headers,
            state=state,  # test extra query
            q="patron_pid:{}".format(str(user.id)),
        )
        _validate_only_patron_loans(res, user, state)


def test_patrons_cannot_search_other_loans(
    client, json_headers, users, testdata
):
    """Test that patrons cannot search for loans of other patrons."""
    user_login(client, "patron1", users)
    res = _search_loans(
        client,
        json_headers,
        state="PENDING",  # test extra query
        q="patron_pid:{}".format(str(users["patron2"].id)),
    )
    assert res.status_code == 403
