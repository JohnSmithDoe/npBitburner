import {NPProcess} from 'scripts/model/npProcess';
import {ENPVirusModes} from 'scripts/utils/npConsts';
import {canRunVirus, getAttackingThreads, getNPHome, getNPNetwork, getNPPlayer, getNPServers, getTopHackingSystems, hrMoney, hrNumber, hrPercentage} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPPlayer, INPSystem} from '../../@types/npTypes';


function getHackingStats(ns: NS, systems: INPSystem[], serverfarm: INPSystem[], home: INPSystem) {
  const stats = {
    systems:       0,
    servers:       0,
    rootAccess:    0,
    hackable:      0,
    nukeable:      0,
    backdoors:     0,
    virusRunning:  0,
    canrunvirus:   0,
    threads:       0,
    homeThreads:   0,
    serverThreads: 0,
    topSystem:     getTopHackingSystems(systems.filter(system => system.state.hackable), 75)
                     .map(system => {return {system, attackThreads: 0, genXPThreads: 0};})

  };

  for (const system of serverfarm) {
    stats.servers++;
    stats.serverThreads += system.threads;
    stats.topSystem.forEach(topdog => {
      topdog.attackThreads += getAttackingThreads(ns, system, topdog.system.host, ENPVirusModes.drainSystem);
      topdog.genXPThreads += getAttackingThreads(ns, system, topdog.system.host, ENPVirusModes.generateXP);
    });
  }
  for (const system of systems) {
    stats.systems++;
    if (system.state.rootAccess) {
      stats.rootAccess++;
      if (canRunVirus(ns, system)) {
        stats.canrunvirus++;
        stats.threads += system.threads;
        stats.topSystem.forEach(data => {
          data.attackThreads += getAttackingThreads(ns, system, data.system.host, ENPVirusModes.drainSystem);
          data.genXPThreads += getAttackingThreads(ns, system, data.system.host, ENPVirusModes.generateXP);
        });
      }
    }
    if (system.state.hackable) stats.hackable++;
    if (system.state.backdoor) stats.backdoors++;
    if (system.state.nukeable) stats.nukeable++;
    if (system.state.virusRunning) stats.virusRunning++;
  }
  stats.topSystem.forEach(data => {
    data.attackThreads += getAttackingThreads(ns, home, data.system.host, ENPVirusModes.drainSystem);
    data.genXPThreads += getAttackingThreads(ns, home, data.system.host, ENPVirusModes.generateXP);
  });
  stats.topSystem.sort((a, b) => b.attackThreads - a.attackThreads);
  stats.homeThreads = home.threads;

  return stats;
}

export function printHackingStats(process: NPProcess, systems: INPSystem[], serverfarm: INPSystem[], home: INPSystem, player: INPPlayer) {
  const {ns, log} = process;
  const stats = getHackingStats(ns, systems, serverfarm, home);

  log.setLoggingChars(60);
  log.headline('NP-Hacking');
  log.value(`Systems/Root/Infected`, `${stats.systems}/${stats.rootAccess}/${stats.virusRunning}(${stats.canrunvirus})`);
  log.value(`Hackable/Backdoor/Nukeable`, `${stats.hackable}/${stats.backdoors}/${stats.nukeable}`);
  log.value(`System/Servers/Home (t=)`, `${stats.threads}/${stats.serverThreads}/${stats.homeThreads}(${stats.homeThreads + stats.threads + stats.serverThreads})`);
  log.line();
  systems.filter((a) => player.hackingLevel < a.requiredHackingLevel && Math.abs(a.requiredHackingLevel - player.hackingLevel) < 50).forEach(nextSystem => {
    log.value(nextSystem.host, `${nextSystem.requiredHackingLevel}/${hrMoney(nextSystem.maxMoney)}/${hrMoney(nextSystem.state.money)}`);
  });
  log.line();
  systems.filter((a) => player.hackingLevel > a.requiredHackingLevel && a.maxMoney > 0)
         .map(system => {
           const action = system.state.securityLevel > system.minSecurityLevel ? 'Weaken' :
             system.state.money < 0 ? 'Increasing' : 'Hacking';
           return Object.assign(system, {action});
         })
         .sort((a, b) => a.action.localeCompare(b.action))
         .forEach(system => {
           log.value(`${system.action} ${system.host}`, `${hrNumber(system.state.securityLevel)}/${hrNumber(system.minSecurityLevel)}/${hrMoney(system.state.money)}/${hrMoney(system.maxMoney)}`);
         });
  log.line();
  log.headline('Top-Ten-Hacking', false);
  stats.topSystem.forEach(
    (item, index) =>
      log.value(`#${index + 1} ${item.system.host}`, `${hrPercentage(item.system.state.hackChance)} ${hrMoney(item.system.state.money)} t=${item.attackThreads} txp=${item.genXPThreads}`,)
  );
  log.line();
  log.resetLoggingChars();
}

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Hacking-Monitor', [],
                                {});
  await process.run(async () => {
    const network = await getNPNetwork(ns);
    const serverfarm = await getNPServers(ns, false);
    printHackingStats(process, network, serverfarm, getNPHome(ns), getNPPlayer(ns));
  });
}
