npBitburner
=====

Small TypeScript Framework for the very nice game Bitburner:

https://danielyxie.github.io/bitburner/
https://store.steampowered.com/app/1812820/Bitburner/

How to Setup
========

> run "yarn install"

> run "npm run build"

> Copy all build files to the Bitburner game
use IDE-Plugin: https://plugins.jetbrains.com/plugin/18338-bitburner-connector

Aliases
----

copy + paste the full block into the terminal:

> alias np-build="run build.js";
alias np-build-check="run build.js --mode=list";
alias htop="run scripts/actions/htop.js tail";
alias np-connect="run scripts/actions/connect.js terminal";
alias np-startup="run scripts/controller/npServiceController.js startup";
alias np-monitor="run scripts/controller/npMonitorController.js terminal";

> Call np-build

This should generate the needed filestructure

> Call np-startup 

This starts all the services and basically takes control of the game :D

Have fun !!!

TODO
====
* Documentation :D
* read write port to change the running service strategy
* read write file to save/load the config and state
* current: one hack per target with max threads => rest gain exp => maybe switch to a scheduler.... 
* solveContracts fix bugs and performance and add missing types
* buystuff
  * 1 home ram :D 
  * 2 tor and programs
  * 3 augs
  * 4 others
* nice up monitors pagination and output
* clean up aliases
* Strategy
  * buy 64gb ram for home upgrade ??
  * buy augs from faction by faction top goal for activity
  * study free till programs are bought then switch to study expensive or create program when in negative money?
  * if done spend money on stuff
  * while that
    * manage Serverfarm ?? 
    * manage Hackrating ??
    * manage Hacknet    ??
    * Join Faction -> dependencies remember what we got from whom
    * study based on ROI or always the free or the expensive one?? Strategy
    * augs and faction work buy what when 

* ROI
  * hacking ROI
  * serverfarm ROI
  * Hacknet ROI
  * Faction join ROI
  * buy or create program ROI
* Future
  * company
  * crimes?stocks?
