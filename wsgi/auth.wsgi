"""
"""

def check_password(environ, user, password):

    if user == 'wapi':
        if password == 'wapi':
            return True
        return False
    return None
