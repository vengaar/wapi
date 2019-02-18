# wapi
Web Ansible Playbook Interface

Based on

* https://github.com/vengaar/liftree to display/browse playbooks
* https://github.com/vengaar/ansible-ws to handle Ansible

**Currently in DEV**

# Demo

[demo](http://52.47.108.127/show)

# Setup

## Prerequisite

* For installation
  * Git
* Python => 3.6
* Ansible

## Procedure

**CAUTION : currently require to have SELinux in Permissive mode**

### Ubuntu >= 18.04.1 LTS

As root on your server

~~~~
apt-get install ansible
git clone https://github.com/vengaar/wapi.git
ansible-playbook wapi/setup/playbooks/setup.yml
~~~~

### Fedora >= 28

As root on your server

~~~~
dnf install ansible
git clone https://github.com/vengaar/wapi.git
ansible-playbook wapi/setup/playbooks/setup.yml
~~~~

### To test devel

~~~~
git clone https://github.com/vengaar/wapi.git
cd wapi
git checkout devel
git pull
ansible-playbook setup/playbooks/setup.yml -e "git_version=devel" --diff
~~~~

Go on http://localhost/show

In the search navbar type `wapi/wapi` and select a test playbook

# Ansible integration

## Make your playbook visible in WAPI

To have playbook just visible update `liftree.conf` of wapi to defined the folder with your playbooks.

Caution : the folder and files must be readable by the wapi_user used. 

*The wapi_user must also have permissions to read the ssh key used by ansible*

# WAPI format

To have extra_vars managed by form in wapi.

You must defined in the first play of your playbook a variable wapi the the informations.

See wiki
