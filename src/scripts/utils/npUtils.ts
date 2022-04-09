import {NPProcess} from 'scripts/model/npProcess';
import {CNPAllPrograms, ENPCities} from 'scripts/utils/npBitburner';
import {scanNetwork} from 'scripts/utils/npCheapUtils';
import {CNPFileExtContract, CNPHomeRamSaveAmount, CNPPathSeperator, ENPScripts, ENPVirusModes, TNPVirusProcess} from 'scripts/utils/npConsts';
import {getMaxThreadCount, getOwnedAugmentations} from 'scripts/utils/npNetscript';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPFaction, INPPlayer, INPSystem, TNPLogLevel, TNPServerfarmServer} from '../../@types/npTypes';


//<editor-fold desc="*** String Formating ***">

function toThreshold(value: number, thresh: number, units: string[], dp = 1) {
  if (value === Infinity || value === -Infinity) return value.toString(10);
  if (Math.abs(value) < thresh) {
    return value.toFixed(dp) + units[0];
  }
  let u = 0;
  const r = 10 ** dp;
  do {
    value = value / thresh;
    ++u;
  } while ((Math.abs(value) * r) / r >= thresh && u < units.length - 1);

  return value.toFixed(dp) + units[u];

}

/**
 * Format number as human-readable text.
 *
 * @param {number} value money value.
 * @param {number} dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function hrMoney(value, dp = 2) {
  return '$' + toThreshold(value, 1000, ['', 'k', 'm', 'b', 't', 'qt'], dp);
}

export function hrNumber(value, dp = 2) {
  return toThreshold(value, 1000, ['', 'k', 'm', 'b', 't', 'qt'], dp);
}

/**
 * Format number as human-readable text.
 *
 * @param {number} value Number of bytes.
 * @param {number} dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function hrRam(value, dp = 0) {
  return toThreshold(value, 1024, ['GB', 'TB', 'QB'], dp); // start at gb??? TODO: check
}

/**
 * Format number as human-readable text.
 *
 * @param {number} value percentage [0-1].
 * @param {number} dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function hrPercentage(value, dp = 2) {
  return (100 * value).toFixed(dp) + '%';
}

//</editor-fold>

//<editor-fold desc="*** Get the Game as NPObjects :) ***">

export function getNPPlayer(ns: NS): INPPlayer {
  const nsPlayer = ns.getPlayer();
  // @ts-ignore
  const karma: number = ns.heart.break();
  let player: INPPlayer = {
    name:          'Letothec0dem0nkey',
    hackingLevel:  ns.getHackingLevel(),
    hackingPorts:  0,
    tor:           nsPlayer.tor,
    files:         [],
    money:         ns.getServerMoneyAvailable('home'),
    city:          nsPlayer.city as ENPCities,
    karma,
    installedAugs: getOwnedAugmentations(ns, false).length, //TODO RAM Cost????????????????
    augmentations: getOwnedAugmentations(ns, true),//TODO RAM Cost????????????????
  };
  for (const fileName of CNPAllPrograms) {
    if (ns.fileExists(fileName)) {
      player.files.push(fileName);
      player.hackingPorts++;
    }
  }
  return player;
}

function canNukeSystem(system: INPSystem, player: INPPlayer): boolean {
  return (!system.state.rootAccess) && (system.requiredPorts <= player.hackingPorts);
}

function canHackSystem(system: INPSystem, player: INPPlayer): boolean {
  return (system.state.rootAccess) && (system.requiredHackingLevel <= player.hackingLevel);
}

function getHackRating(system: INPSystem, player: INPPlayer): number {
  let rating = !system.state.hackable ? -Infinity : system.state.hackChance * system.state.money;
  if (system.state.hackChance === 1 && system.state.money > 500e3) rating *= 2;
  if (system.state.hackable && system.state.money > 1e9) rating *= 2;
  if (system.state.hackable && system.maxMoney > 1e9) rating *= 2;
  return rating;
}

export function mapHostToNPSystem(ns: NS, host: string, path: string[], player: INPPlayer) {
  const system: INPSystem = {
    host:                 host,
    path:                 path.join(CNPPathSeperator),
    maxMoney:             ns.getServerMaxMoney(host),
    maxRam:               ns.getServerMaxRam(host),
    minSecurityLevel:     ns.getServerMinSecurityLevel(host),
    threads:              getMaxPossibleVirusThreads(ns, host, host === 'home' ? CNPHomeRamSaveAmount : 0),
    requiredHackingLevel: ns.getServerRequiredHackingLevel(host),
    requiredPorts:        ns.getServerNumPortsRequired(host),
    state:                {
      rootAccess:    ns.hasRootAccess(host),
      backdoor:      ns.getServer(host).backdoorInstalled,
      securityLevel: ns.getServerSecurityLevel(host),
      hackChance:    ns.hackAnalyzeChance(host),
      money:         ns.getServerMoneyAvailable(host),
      usedRam:       ns.getServerUsedRam(host),
      virusRunning:  ns.scriptRunning(ENPScripts.Virus, host),
      deployed:      !!ns.ls(host, ENPScripts.Virus).length,
      freeRam:       -1,
      hackable:      false,
      hackRating:    -1,
      nukeable:      false
    }
  };
  // Hack Chance times 3 times the available money ?
  system.state.freeRam = system.maxRam - system.state.usedRam;
  system.state.nukeable = canNukeSystem(system, player);
  system.state.hackable = canHackSystem(system, player);
  system.state.hackRating = getHackRating(system, player);
  return system;
}

export async function getNPNetwork(ns: NS): Promise<INPSystem[]> {
  const result: INPSystem[] = [];
  const player = getNPPlayer(ns);
  await scanNetwork(ns, async (host, path) => {
    if (!host.startsWith('foo-') && (host !== 'home') && (host !== 'foo')) {
      const npHost = mapHostToNPSystem(ns, host, path, player);
      result.push(npHost);
    }
  });
  return result;
}

export async function getNPServers(ns: NS, includeHome = true): Promise<INPSystem[]> {
  const result: INPSystem[] = [];
  const player = getNPPlayer(ns);
  await scanNetwork(ns, async (host, path) => {
    if (host.startsWith('foo-') || (host === 'foo') || (includeHome && (host === 'home'))) {
      const npHost = mapHostToNPSystem(ns, host, path, player);
      result.push(npHost);
    }
  });
  return result;
}

export function getNPHome(ns): INPSystem {
  return mapHostToNPSystem(ns, 'home', ['home'], getNPPlayer(ns));
}

export function getContractsCount(ns: NS, systems: INPSystem[]) {
  return systems.reduce((sum, system) => sum + ns.ls(system.host, CNPFileExtContract).length, 0);
}

export function getFactions(ns: NS) {
  const result: INPFaction[] = [];
  for (const faction of ns.getPlayer().factions) {
    const npfaction: INPFaction = {faction, augs: [], reputation: ns.getFactionRep(faction)};
    const augs = ns.getAugmentationsFromFaction(faction);
    for (let aug of augs) {
      npfaction.augs.push(
        {
          name:       aug,
          faction,
          price:      ns.getAugmentationPrice(aug),
          stats:      ns.getAugmentationStats(aug),
          reputation: ns.getAugmentationRepReq(aug),
          prereq:     ns.getAugmentationPrereq(aug)
        });
    }
    result.push(npfaction);
  }
  return result;
}

//</editor-fold>

//<editor-fold desc="*** Helper function mostly filters *** ">

export function getMaxPurchasableServer(ns: NS) {
  let ram = 1024;
  let cost = ns.getPurchasedServerCost(ram);
  while (cost < Infinity) {
    ram *= 2;
    cost = ns.getPurchasedServerCost(ram);
  }
  ram /= 2;
  cost = ns.getPurchasedServerCost(ram);
  return {ram: ram, cost};
}

export function getMaxAffordableServer(ns: NS) {
  let ram = 1;
  let cost = ns.getPurchasedServerCost(ram);
  while (cost < getNPPlayer(ns).money) {
    ram *= 2;
    cost = ns.getPurchasedServerCost(ram);
  }
  ram /= 2;
  cost = ns.getPurchasedServerCost(ram);
  return {ram: ram, cost};
}

export function getTopSystems(systems: INPSystem[], count = 10) {
  return systems.sort((a, b) => b.state.money - a.state.money)
                .filter((host, index) => index < count);
}

export function getTopHackingSystems(systems: INPSystem[], count = 10) {
  return systems.sort((a, b) => b.requiredHackingLevel - a.requiredHackingLevel)
                .filter((host, index) => index < count);
}

export function getTopSystemsMaxMoney(systems: INPSystem[], count = 10) {
  return systems.sort((a, b) => b.maxMoney - a.maxMoney)
                .filter((host, index) => index < count);
}

export function getHighestMaxMoney(systems: INPSystem[]) {
  return systems.reduce((prev, current) => {
    return prev.maxMoney < current.maxMoney ? {host: current, maxMoney: current.maxMoney} : prev;
  }, {host: null, maxMoney: 0});
}

export function getRichestSystem(systems: INPSystem[]) {
  return systems.reduce((prev, current) => {
    return (!prev || (prev.state.money < current.state.money)) ? current : prev;
  });
}

export function getHighestRequiredHacklevel(systems: INPSystem[]) {
  return systems.reduce((prev, current) => {
    return (prev === null || ((prev as INPSystem).requiredHackingLevel < current.requiredHackingLevel)) ? current : prev;
  }, null);
}

export function getHighestHackRating(systems: INPSystem[]) {
  return systems.reduce((prev, current) => {
    return (prev === null || ((prev as INPSystem).state.hackRating < current.state.hackRating)) ? current : prev;
  }, null);
}

export function getRunningVirus(systems: INPSystem[]) {
  return systems.filter(host => host.state.virusRunning);
}

export function getHackable(systems: INPSystem[]) {
  return systems.filter(system => system.state.hackable);
}

export function getTargetable(systems: INPSystem[]) {
  return systems.filter(system => system.state.hackable && (system.maxMoney > 0));
}

export function getNukeable(systems: INPSystem[]) {
  return systems.filter(system => system.state.nukeable);
}

export function getDeployable(systems: INPSystem[]) {
  return systems.filter(system => !system.state.deployed);
}

export function getDeployed(systems: INPSystem[]) {
  return systems.filter(system => system.state.deployed);
}

export function getRooted(systems: INPSystem[]) {
  return systems.filter(system => system.state.rootAccess);
}

export function getVirusRunnable(ns: NS, systems: INPSystem[]) {
  return systems.filter(system => system.state.rootAccess && (system.threads > 0));
}

export function getBackdoorable(systems: INPSystem[]) {
  return systems.filter(system => system.state.hackable && !system.state.backdoor);
}


export function scriptDetail(ns: NS, script: string, host = 'home') {
  return {usage: ns.getScriptRam(script, host), host: {used: ns.getServerUsedRam(host), max: ns.getServerMaxRam(host)}};
}

//</editor-fold>

export function printScriptArguments(process: NPProcess, lvl: TNPLogLevel, comment: string) {
  const {ns, log} = process;
  log.headline(comment, true, lvl);
  log.wrap(ns.getScriptName(), lvl);
  ns.args.forEach((arg, idx) => log.value('Arg ' + idx, arg.toString()));
}

export function getVirusProcesses(ns: NS, system: INPSystem): TNPVirusProcess[] {
  const result: TNPVirusProcess[] = [];
  ns.ps(system.host).forEach((process) => {
    if (process.filename === ENPScripts.Virus) {
      // First argument is --target=  Snd argument is --mode=
      const targetArg = process.args[0];
      const modeArg = process.args[1];
      const target = targetArg.substring(targetArg.indexOf('=') + 1);
      const mode = modeArg.substring(modeArg.indexOf('=') + 1) as ENPVirusModes;
      result.push({pid: process.pid, target: target, threads: process.threads, mode});
    }
  });
  return result;
}

export function isRunningVirus(ns: NS, system: INPSystem, target: string, threadCount: number, mode: ENPVirusModes) {
  return !!getVirusProcesses(ns, system).find(process => (process.target === target) && (process.threads === threadCount) && (process.mode === mode));
}


export function canRunVirus(ns: NS, system: INPSystem) {
  const needed = ns.getScriptRam(ENPScripts.Virus, system.host);
  return (needed <= system.maxRam);
}

export function getAttackingThreads(ns: NS, system: INPSystem, target: string, mode?: ENPVirusModes) {
  return getVirusProcesses(ns, system)
    .filter(process => process.target === target && (!mode || process.mode === mode))
    .reduce((prev, current) => prev + current.threads, 0);

}

export function getMaxPossibleVirusThreads(ns: NS, host: string, saveRam = 0) {
  return getMaxThreadCount(ns, ENPScripts.Virus, host, saveRam, true);
}

export function system2server(ns: NS, system: INPSystem): TNPServerfarmServer {
  return {
    host:    system.host,
    ram:     system.maxRam,
    used:    system.state.usedRam,
    free:    system.state.freeRam,
    threads: getMaxPossibleVirusThreads(ns, system.host)
  };
}


