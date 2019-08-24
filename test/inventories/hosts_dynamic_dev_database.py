#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
"""

import logging

from hosts_dynamic import WapiAbsractInventory


class WapiInventoryDevDatabase(WapiAbsractInventory):
    """
    """

    def _generate_inventory(self):
        """
        """
        return self._generate_fake_inventory(["database", "dev"])


if __name__ == "__main__":
    """
    """
    logging.basicConfig(level=logging.WARNING)
    WapiInventoryDevDatabase()
