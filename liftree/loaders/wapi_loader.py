import yaml

def get_data(path, params):
    try:
        with open(path, 'r') as stream:
            data = yaml.load(stream)
        if 'vars' in data[0]:
            wapi = data[0]['vars'].get('wapi', dict())
        else:
            wapi = dict(warning='No wapi data found')
    except Exception as e:
        wapi = dict(error=f'{str(e)}')
    return wapi
