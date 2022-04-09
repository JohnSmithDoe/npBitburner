import {NPProcess} from 'scripts/model/npProcess';
import {CNPAllPrograms, CNPCityFactions, CNPFactions, CNPProgramStats, CNPTorRouter, ENPAugmentations, ENPFactions, ENPPrograms, TCityFaction, TCrimeFaction, TEndGameFaction, THackingFaction, THacknetFaction, TMegaCorpFaction, TSilhouetteFaction} from 'scripts/utils/npBitburner';
import {getOwnedAugmentations} from 'scripts/utils/npNetscript';
import {getBackdoorable, getNPNetwork, getNPPlayer, hrMoney} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';

// ADR-V1 Pheromone Gene
// Social Negotiation Assistant (S.N.A)
// Neuroreceptor Management Implant
// Nuoptimal Nootropic Injector Implant

/**
 * Note that creating a program using this function has the same hacking level requirements as it normally would. These level requirements are:
 * * BruteSSH.exe: 50
 * * FTPCrack.exe: 100
 * * relaySMTP.exe: 250
 * * HTTPWorm.exe: 500
 * * SQLInject.exe: 750
 */
function checkCreateProgram(ns: NS) {
  const player = getNPPlayer(ns);
  for (let program of CNPAllPrograms) {
    if (player.hackingLevel > CNPProgramStats[program].lvl) {
      if (player.files.indexOf(program) < 0) {
        return program;
      }
    }
  }
}

function checkFactionInvites(ns: NS) {
  return ns.checkFactionInvitations().filter(faction => CNPCityFactions.indexOf(faction as ENPFactions) < 0);
}

export type TNPTaskType = 'Join Faction' | 'Study at University' | 'Write Program' | 'Buy Stuff' | 'Work for Faction';
export type TNPStuff = 'Tor Router' | 'Program' | 'Server' | 'Hacknode';
export type TNPCourse = { university: 'rothman university', course: 'Study Computer Science' }
export type TNPFactionWork = { faction: string, work: string }

export interface INPTask<T = TNPStuff | TNPCourse | TNPFactionWork | string[] | string> {
  type: TNPTaskType;

  installBackdoors: string[];
  data: T;
}

export function taskToTxt(task: INPTask) {
  switch (task.type) {
    case 'Join Faction':
      return `${(task as INPTask<string[]>).data.join(',')}`;
    case 'Study at University':
      return `${(task as INPTask<TNPCourse>).data.university}: ${(task as INPTask<TNPCourse>).data.course}`;
    case 'Buy Stuff':
    case 'Write Program':
    case 'Work for Faction':
      return `${task.type}: ${task.data}`;
  }
}

export async function getCurrentTask(process: NPProcess): Promise<INPTask> {
  const {ns, log} = process;
  const network = await getNPNetwork(ns);
  const installBackdoors = getBackdoorable(network).map(system => system.host);
  const factionInvites = checkFactionInvites(ns);
  if (factionInvites.length) {
    return {type: 'Join Faction', data: factionInvites, installBackdoors};
  }
  const buyStuff = checkBuyStuff(process);
  if (buyStuff) {
    return {type: 'Buy Stuff', data: buyStuff, installBackdoors};
  }

  // check if we can buy this
  const program = checkCreateProgram(ns);
  if (program) {
    return {type: 'Write Program', data: program, installBackdoors};
  }
  return {
    type: 'Study at University',
    data: {university: 'rothman university', course: 'Study Computer Science'},
    installBackdoors
  };
  // check hacking level
  // check money
  // check programs
  // check server
  // check hacknet


}

function checkBuyStuff(process: NPProcess) {
  const {ns, log} = process;
  let player = getNPPlayer(ns);
  if (!player.tor && (player.money > CNPTorRouter.cost)) {
    return CNPTorRouter.name;
  } else if (player.tor) {
    for (const programName in ENPPrograms) {
      const program: ENPPrograms = ENPPrograms[programName];
      if (player.files.indexOf(program) < 0) {
        if (player.money > CNPProgramStats[program].price) {
          return program;
        } else {process.log.info('Not enough money for', program, ' ', hrMoney(CNPProgramStats[program].price));}
      }
    }
  }
  return false;
}


export function checkAugmentations(process: NPProcess) {
  const {ns, log} = process;
  //const factionOrder: ENPFactions[] = [ENPFactions.CyberSec, ENPFactions.NiteSec]; // TODO:
  const factionOrder: ENPFactions[] = [ENPFactions.NiteSec, ENPFactions.CyberSec];
  const owned = getOwnedAugmentations(ns, true);
  let next: ENPFactions|false = false;
  for (const faction of factionOrder) {
    const augs: ENPAugmentations[] = CNPFactions[faction].augs;
    const hasAllAugs = augs.reduce((prev, current) => prev && (owned.indexOf(current) >= 0), true);
    if(!hasAllAugs){
        process.log.info('Player should go for ', faction);
        next = faction;
        break;
    }
  }
  if(!next) process.log.info('Player can do what ever he wants');
  return next;
}

export function checkFactionRequirements(ns: NS, faction: ENPFactions) {
  const player                                             = getNPPlayer(ns),
        req                                                = CNPFactions[faction].req,
        {cities, money, prevents}                          = (req as TCityFaction),
        {backdoor}                                         = (req as THackingFaction),
        {megacorp, reputation}                             = (req as TMegaCorpFaction),
        {combatStats, karma, murders, agent, hackingLevel} = (req as TCrimeFaction),
        {augs, both}                                       = (req as TEndGameFaction),
        {totalLvls, totalRam, totalCores}                  = (req as THacknetFaction),
        {boss}                                             = (req as TSilhouetteFaction);
  let fullfilled = true;
  if (cities) {
    fullfilled &&= cities.indexOf(player.city) >= 0;
  }
  if (money) {
    fullfilled &&= player.money >= money;
  }
  if (backdoor) {
    fullfilled &&= ns.getServer(backdoor).backdoorInstalled;
  }
  if (megacorp && reputation) {
    fullfilled &&= ns.getCompanyRep(megacorp) > reputation;
  }
  if (karma) {
    fullfilled &&= player.karma < karma;
  }
  if (hackingLevel) {
    fullfilled &&= player.hackingLevel >= hackingLevel;
  }
  if (augs) {
    fullfilled &&= player.installedAugs >= augs;
  }

  if (murders) {}
  if (combatStats) {}
  if (boss) {}

  if (totalLvls && totalRam && totalCores) {}

  if (both) {
    if (combatStats) {}
    if (hackingLevel) { }
  }
  return fullfilled;
}
