# -*- coding: utf-8 -*-
#
# Copyright (C) 2018 CERN.
#
# invenio-app-ils is free software; you can redistribute it and/or modify it
# under the terms of the MIT License; see LICENSE file for more details.

"""Ils records' permissions."""
from __future__ import unicode_literals

from flask_principal import ActionNeed, RoleNeed, UserNeed
from invenio_access import Permission, any_user
from six import string_types

librarian_role = RoleNeed("librarian")
create_records_action = ActionNeed("create-records")


def record_create_permission_factory(record=None):
    """Record create permission factory."""
    return RecordPermission(record=record, action="create")


def record_update_permission_factory(record=None):
    """Record update permission factory."""
    return RecordPermission(record=record, action="update")


def record_delete_permission_factory(record=None):
    """Record delete permission factory."""
    return RecordPermission(record=record, action="delete")


def record_read_permission_factory(record=None):
    """Record read permission factory."""
    return RecordPermission(record=record, action="read")


class RecordPermission(Permission):
    """Record permission.

    - Create action given to librarian, admin and specified users.
    - Read access given to everyone with possibility to hide.
    - Delete access to admin and specified users.
    """

    def __init__(self, record, action):
        """Constructor."""
        self.record = record
        self.current_action = action
        record_needs = self.collect_needs()
        super(RecordPermission, self).__init__(*record_needs)

    def collect_needs(self):
        """Collect permission policy per action."""
        if self.current_action == "read":
            return self.read_permissions()
        elif self.current_action == "create":
            return [create_records_action, librarian_role]
        elif self.current_action == "update":
            return self.record_needs() + [librarian_role]
        else:
            return self.record_needs()

    def read_permissions(self):
        """Define read permission policy per record."""
        if self.is_public():
            return [any_user]
        else:
            return self.record_needs() + [librarian_role]

    def record_allows(self):
        """Read what record allows per action."""
        return self.record.get("_access", {}).get(self.current_action, [])

    def record_needs(self):
        """Create needs of the record."""
        needs = []
        for access_entity in self.record_allows():
            try:
                if isinstance(access_entity, string_types):
                    needs.append(UserNeed(int(access_entity)))
                elif isinstance(access_entity, int):
                    needs.append(UserNeed(access_entity))
            except ValueError:
                needs.append(RoleNeed(access_entity.lower()))
        return needs

    def is_public(self):
        """Check if the record is fully public.

        In practice this means that the record doesn't have the ``access``
        key or the action is not inside access or is empty.
        """
        return "_access" not in self.record or not self.record.get(
            "_access", {}
        ).get(self.current_action)
