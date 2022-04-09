import {NPProcess} from 'scripts/model/npProcess';
import {CNPAllPrograms, ENPPrograms} from 'scripts/utils/npBitburner';
import {ENPScripts} from 'scripts/utils/npConsts';
import {NS, ProcessInfo} from '../../@types/NetscriptDefinitions';
import {INPSystem} from '../../@types/npTypes';

export function isRunning(ns: NS, script: ENPScripts, host = 'home', args?: string[]) {
  return args ? ns.isRunning(script, host, ...args) : ns.scriptRunning(script, host);
}

export function startScript(ns: NS, script: ENPScripts, args: string[], threads = 1, host = 'home') {
  return ns.exec(script, host, threads, ...args) > 0;
}

export function killScript(ns: NS, script: string, host = 'home') {
  return ns.scriptKill(script, host);
}

export function getProcesses(ns: NS, host = 'home'): ProcessInfo[] {
  return ns.ps(host);
}

export function getMaxThreadCount(ns: NS, script: ENPScripts, host: string, saveRam = 0, assumeAllKilled = false) {
  const maxRam = ns.getServerMaxRam(host);
  const usedRam = ns.getServerUsedRam(host);
  let freeRam = (assumeAllKilled ? maxRam : (maxRam - usedRam)) - saveRam;
  const neededRam = ns.getScriptRam(script, host);
  return Math.floor(freeRam / neededRam);
}

export function canRunScript(ns: NS, script: ENPScripts, host: string, saveRam = 0, assumeAllKilled = false) {
  return getMaxThreadCount(ns, script, host, saveRam, assumeAllKilled) > 0;
}

export function getScriptRamCost(ns: NS, script: string, host: string) {
  return ns.getScriptRam(script, host);
}

export function getOwnedAugmentations(ns:NS, purchased = false){
  return ns.getOwnedAugmentations(purchased);
}

export async function deploy(process: NPProcess, systems: INPSystem[], files: string[]) {
  const {ns, log} = process;
  for (const target of systems) {
    for (const filename of files) {
      log.debug('Uploading ', filename, ' to ', target.host);
      await ns.scp(filename, target.host);
    }
  }
}

export function openSystems(process: NPProcess, systems: INPSystem[]) {
  const {ns, log} = process;
  for (const target of systems) {
    log.info('Opening System: ', target.host);
    for (const fileName of CNPAllPrograms) {
      log.debug('Executing: ', fileName);
      if (ns.fileExists(fileName)) {
        if (fileName === ENPPrograms.BruteSSH) {
          ns.brutessh(target.host);
        } else if (fileName === ENPPrograms.FTPCrack) {
          ns.ftpcrack(target.host);
        } else if (fileName === ENPPrograms.RelaySMTP) {
          ns.relaysmtp(target.host);
        } else if (fileName === ENPPrograms.HTTPWorm) {
          ns.httpworm(target.host);
        } else if (fileName === ENPPrograms.SQLInject) {
          ns.sqlinject(target.host);
        }
      }
    }
    log.debug('Nuking System: ', target.host);
    ns.nuke(target.host);
    log.assert(ns.hasRootAccess(target.host), 'Attack on Server ', target.host);
  }
}

export function scrub(process: NPProcess, systems: INPSystem[], files: string[]) {
  const {ns, log} = process;
  log.info(systems.length);
  for (const target of systems) {
    log.info(target.host);
    log.assert(ns.killall(target.host), 'Stopping all processes on ', target.host);
    for (const filename of files) {
      log.assert(ns.rm(filename, target.host), 'Removing ', filename, ' from ', target.host);
    }
  }
}
