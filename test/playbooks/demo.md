
## Bienvenu.e.s sur la demo de WAPI !


### Lancer un playbook

Plusieurs playbooks de test sont disponibles pour comprendre le comportement.

NB : hormis le playbook `remote.yml` les playbook s'execute sur localhost.

Pour tester un playbook

* Commencez par chercher les playbooks disponibles
en tapant `playbook` dans le search à droite dans la barre de navigation.

* Selectionner le playbook à lancer (par exemple `test.yml`)

* La page d'un playbook est découpé en trois

* Dans la partie `Launch` un formulaire permet de lancer le playbook.
  * Ce formulaire est générée en function de la variable `wapi` définie dans le playbook
  * Regarder la partie `Code` pour voir comme la variable est définie


### Agent SSH

Le playbook `remote.yml` fait une connexion ssh sur lui-même... il lui faut d'un une clef.

Si elle n'est pas déjà chargée, charger la clef `ansible-ws` 
(la passphrase de la clef est  `ansible-ws`)
dans la page `Configs` accéssible depuis le menu.


### Liftree

Liftree est le framework sur lequel se base WAPI.

Vous pouvez accéder à la page de test de Liftree [ici](/show?path=~/liftree/tests/README.md)
