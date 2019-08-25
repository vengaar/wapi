#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
"""

import logging

from hosts_dynamic import WapiAbsractInventory


class WapiInventoryProdDatabase(WapiAbsractInventory):
    """
    """

    def _generate_inventory(self):
        """
        """
        return self._generate_fake_inventory(["database", "prod"])


if __name__ == "__main__":
    """
    """
    logging.basicConfig(level=logging.WARNING)
    WapiInventoryProdDatabase()
