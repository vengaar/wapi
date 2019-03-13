import json
import os

def filter_wapi_defaults_extra_vars(extravars):
    """
    """
    defaults = dict()
    for extra_var in extravars:
        name = extra_var['name']
        if 'default' in extra_var:
            defaults[name] = extra_var['default']
        elif 'boolean' in extra_var:
            defaults[name] = extra_var['boolean']
    return defaults

def filter_file_stat(value):
    """
    """
    if os.path.isfile(value):
        return os.stat(value)
    else:
        return value
