# wapi
Web Ansible Playbook Interface

Based on

* https://github.com/vengaar/liftree to display/browse playbooks
* https://github.com/vengaar/ansible-ws to handle Ansible

# Setup

## Prerequisite

* fedora 29
* ansible

## Procedure

As root on your server

~~~~
dnf install ansible
git clone https://github.com/vengaar/wapi.git
ansible-playbook ansible-ws/setup/playbooks/setup.yml -v
~~~~
