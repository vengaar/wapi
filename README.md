# wapi
Web Ansible Playbook Interface

Based on

* https://github.com/vengaar/liftree to display/browse playbooks
* https://github.com/vengaar/ansible-ws to handle Ansible

**Currently in DEV**

# Setup

## Prerequisite

* fedora >= 28
* python >= 3.6
* ansible >= 2.7

## Procedure

As root on your server
**CAUTION** require currently to disable selinux 

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

# Ansible integration

## Make your playbook visible in WAPI

To have playbook just visible update liftree.conf of wapi to defined the folder with your playbooks.

Caution : the folder and files must be readable by the wapi_user used. 

The wapi_user must also have permissions to read the ssh key used by ansible

## inventories

## 

# WAPI format

To have extra_vars managed by form in wapi.

You must defined in the first play of your playbook a variable wapi the the informations.

See examples and also below the `wapi format`

