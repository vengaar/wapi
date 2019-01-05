import json
import subprocess

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



def filter_wapi_grapher(value):
    """
    """
    try:
        cmd = f'ansible-inventory-grapher -i /home/vengaar/wapi/test/inventories/hosts {value} | dot -Tsvg'
        svg = subprocess.check_output(cmd, shell=True)
        return svg
    except:
        'ERROR'
