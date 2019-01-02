import json

def get_data(path, params):

    file_output = path.replace('run.desc', 'run.out')
    file_status = path.replace('run.desc', 'run.status')

    with open(file_status, 'r') as stream:
        data = json.load(stream)
    return data
