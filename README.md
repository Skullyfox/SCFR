# SCFR

## Interface d'installation de la traduction de Star Citizen

Cet outil automatise l'installation des fichiers de traduction de Star Citizen en français et permet également de mettre à jour la traduction à mesure qu'elle progresse.

## Références
* Code de l'application: https://github.com/Skullyfox/SCFR
* Release de l'application: https://github.com/Skullyfox/SCFR/releases/
* [Discord](https://discord.gg/c3CSTa7SAF)
* Vidéo de présentation: https://www.youtube.com/watch?v=BGkQTLGs9cw


## Instructions pour développeur
### Pour build local
* Modifier la version dans package.json
* Tester le build local avec `npm run build`
### Pour build via Github Actions
Après avoir validé qu'un build local fonctionne
* Commit, Push et tag le code avec le numéro de version du package via `npm run release`
