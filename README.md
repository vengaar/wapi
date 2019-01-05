# wapi
Web Ansible Playbook Interface

Based on

* https://github.com/vengaar/liftree to display/browse playbooks
* https://github.com/vengaar/ansible-ws to handle Ansible

# Setup

## Prerequisite

* fedora >= 28
* python >= 3.6
* ansible >= 2.7

## Procedure

As root on your server

* on fedora 28

~~~~
dnf install ansible-python3
git clone https://github.com/vengaar/wapi.git
ansible-playbook-3 wapi/setup/playbooks/setup.yml -v
~~~~

* on fedora 29

~~~~
dnf install ansible
git clone https://github.com/vengaar/wapi.git
ansible-playbook wapi/setup/playbooks/setup.yml -v
~~~~

Go on http://localhost/show

In the search navbar type `wapi` and select the playbook
