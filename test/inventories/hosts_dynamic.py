#!/usr/bin/env python 
#-*- coding: utf-8 -*-

import json

servers = [
    "database-preprod-{number:02d}".format(number=number)
    for number in range(1, 5)
]

inventory = {
    "database_preprod": {
        "hosts": servers,
        "vars": {
            "colors": {
                "blue": "#0000FF",
                "green": "#00FF00",
                "red": "#FF0000",
            }
        },
    },
}

print(json.dumps(inventory, sort_keys=True, indent=4))