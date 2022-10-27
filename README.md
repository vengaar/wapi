[defaults setup role]: https://github.com/vengaar/wapi/tree/master/setup/playbooks/roles/setup/defaults
[demo]: http://52.47.108.127/show/

# wapi
Web Ansible Playbook Interface

Based on

* https://github.com/vengaar/liftree to display/browse playbooks
* https://github.com/vengaar/ansible-ws to handle Ansible

# Demo

~~[demo] (credential : wapi/wapi)~~ ec2 instance no longer available :-(

# Setup

## Prerequisite

* For installation
  * Git
* Python => 3.8
* Ansible

## Defaults

* The default settings are available in defaults of ansible setup role
* See [defaults setup role]
* By default wapi run on port 8042 but you can override it with an ansible extra_vars as `-e "wapi_port=80"`

## Procedure

### Ubuntu >= Ubuntu 20.04.2 LTS

As root on your server

~~~~
apt-get install ansible
git clone https://github.com/vengaar/wapi.git
ansible-playbook wapi/setup/playbooks/setup.yml
~~~~

### To test devel

~~~~
git clone https://github.com/vengaar/wapi.git
cd wapi
git checkout devel
git pull
ansible-playbook setup/playbooks/setup.yml -e "version=devel" --diff
~~~~

Go on http://localhost:8042/show

In the search navbar type `wapi/wapi` and select a test playbook

# Ansible integration

## Make your playbook visible in WAPI

See the wiki page [Howto define my playbooks in WAPI](https://github.com/vengaar/wapi/wiki/Howto-define-my-playbooks-in-WAPI-%3F)

# WAPI format

To have extra_vars managed by form in wapi.

You must defined in the first play of your playbook a variable wapi the the informations.

See wiki pages [Wapi format](https://github.com/vengaar/wapi/wiki/Wapi-format)
