import json

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
