import yaml
import os
from pathlib import PurePosixPath

def get_data(path, params):
    role_dir = os.path.dirname(os.path.dirname(path))
    role_files = []
    for root, subFolder, files in os.walk(role_dir):
        dirname = os.path.basename(root)
        for filename in files: 
            value = os.path.join(root,filename)
            name = PurePosixPath(value).relative_to(role_dir)
            role_files.append({
                'name': name,
                'value': value
            })
    return role_files
