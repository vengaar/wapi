#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
"""

import logging

from hosts_dynamic import WapiAbsractInventory


class WapiInventoryProdWebserver(WapiAbsractInventory):
    """
    """

    def _generate_inventory(self):
        """
        """
        return self._generate_fake_inventory(["webserver", "prod"])


if __name__ == "__main__":
    """
    """
    logging.basicConfig(level=logging.WARNING)
    WapiInventoryProdWebserver()
