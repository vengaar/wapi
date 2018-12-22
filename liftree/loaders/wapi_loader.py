import yaml

def get_data(path, params):
    with open(path, 'r') as stream:
        data = yaml.load(stream)
    if 'vars' in data[0]:
        wapi = data[0]['vars'].get('wapi', dict())
    else:
        wapi = dict()
    return wapi
