import yaml
import os

def get_data(path, params):
    role_dir = os.path.dirname(os.path.dirname(path))
    role_files = []
    for root, subFolder, files in os.walk(role_dir):
#         for directory in directories:
#             print os.path.join(root, directory) 
        dirname = os.path.basename(root)
        for filename in files: 
            role_files.append({
                'name': f'{dirname} > {filename}',
                'value': os.path.join(root,filename)
            })
    return role_files
