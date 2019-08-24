#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
"""

import json
import logging
import argparse
import time
import os


class WapiAbsractInventory(object):
    """
        Produce an Ansible Inventory file based Kloud file
    """

    def __init__(self):
        """
        """
        self._logger = logging.getLogger(self.__class__.__name__)
        self._file_cache = "/tmp/{class_name}.cached".format(class_name=self.__class__.__name__)
        self._parse_cli_args()
        self.refresh_cache = self.args.refresh_cache
        self._logger.info(self._file_cache)
        if self.refresh_cache or not os.path.isfile(self._file_cache):
            self.inventory_json = self._generate_inventory()
        if not self.refresh_cache:
            print(self.inventory_json)

    def _parse_cli_args(self):
        """
            Command line argument processing
        """
        parser = argparse.ArgumentParser(description=self.__doc__)
        parser.add_argument("--list", action="store_true", default=True, help="List instances (default: True)")
        parser.add_argument("--host", action="store", help="Get all the variables about a specific instance")
        parser.add_argument(
            "--refresh-cache",
            action="store_true",
            default=False,
            help="Force refresh of cache (default: False - use cache files)")
        self.args = parser.parse_args()
        self._logger.debug(self.args)

    @property
    def inventory_json(self):
        """
        """
        self._logger.debug("read inventory from cache")
        with open(self._file_cache) as fp:
            return fp.read()

    @inventory_json.setter
    def inventory_json(self, inventory):
        """
        """
        self._logger.debug("write inventory in cache")
        inventory_json = json.dumps(inventory, sort_keys=True, indent=4)
        with open(self._file_cache, "w") as fp:
            fp.write(inventory_json)

    def _generate_inventory(self):
        """
        """
        return

    def _generate_fake_inventory(self, groups, number=5):
        """
        """
        self._logger.debug("generate new inventory")
        servers = [
            "{name}-{id:003d}".format(
                name="-".join(groups),
                id=id
            )
            for id in range(1, number + 1)
        ]
        return {
            group: {
                "hosts": servers,
                "vars": {
                    "ansible_connection": "local",
                    "{group}_ts".format(group=group): time.time(),
                    "colors": {
                        "blue": "#0000FF",
                        "green": "#00FF00",
                        "red": "#FF0000",
                    }
                },
            }
            for group in groups
        }


class WapiInventory(WapiAbsractInventory):
    """
    """

    def _generate_inventory(self):
        """
        """
        return {}


if __name__ == "__main__":
    """
    """
    logging.basicConfig(level=logging.WARNING)
    WapiInventory()
