# wapi
Web Ansible Playbook Interface

Based on

* https://github.com/vengaar/liftree to display/browse playbooks
* https://github.com/vengaar/ansible-ws to handle Ansible

**Currently in DEV**

# Setup

## Prerequisite

* Git for installation
* Python => 3.6
* Ansible installed with python3
* OS
  * Ubuntu >= 18.04.1 LTS
  * fedora >= 28

## Procedure

### Ubuntu

*CAUTION : Need to use pip3, else with apt ansible in stack python2*

As root on your server

~~~~
apt install python3-pip
pip3 install ansible
git clone https://github.com/vengaar/liftree.git
ansible-playbook /home/liftree/liftree/setup/playbooks/setup.yml
git clone https://github.com/vengaar/wapi.git
ansible-playbook-3 wapi/setup/playbooks/setup.yml -v
~~~~

### Fedora

*CAUTION : require currently to disable selinux*

As root on your server

* For fedora 28

~~~~
dnf install ansible-python3
git clone https://github.com/vengaar/wapi.git
ansible-playbook-3 wapi/setup/playbooks/setup.yml -v
~~~~

* For fedora 29

~~~~
dnf install ansible
git clone https://github.com/vengaar/wapi.git
ansible-playbook wapi/setup/playbooks/setup.yml -v
~~~~

Go on http://localhost/show

In the search navbar type `playbook` and select a test playbook

*NB : To install devel version add `-e "git_version=devel"`to ansible command line above*

# Ansible integration

## Make your playbook visible in WAPI

To have playbook just visible update `liftree.conf` of wapi to defined the folder with your playbooks.

Caution : the folder and files must be readable by the wapi_user used. 

*The wapi_user must also have permissions to read the ssh key used by ansible*

# WAPI format

To have extra_vars managed by form in wapi.

You must defined in the first play of your playbook a variable wapi the the informations.

See wiki
