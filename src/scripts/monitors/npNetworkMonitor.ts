import {NPProcess} from 'scripts/model/npProcess';
import {getNPNetwork, getTopSystems, getTopSystemsMaxMoney, hrMoney, hrPercentage, hrRam} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPSystem} from '../../@types/npTypes';

function getNetworkStats(ns: NS, systems: INPSystem[]) {
  const stats = {
    systems:    0,
    rootAccess: 0,
    money:      {
      total: 0,
      best:  {host: '', value: 0}
    },
    maxmoney:   {
      total: 0,
      best:  {host: '', value: 0}
    },
    ram:        {
      total: 0,
      best:  {host: '', value: 0}
    },
  };
  for (const system of systems) {
    stats.systems++;
    if (system.state.rootAccess) stats.rootAccess++;
    if (stats.ram.best.value < system.maxRam) {
      stats.ram.best = {host: system.host, value: system.maxRam};
    }
    if (stats.money.best.value < system.state.money) {
      stats.money.best = {host: system.host, value: system.state.money};
    }
    if (stats.maxmoney.best.value < system.maxMoney) {
      stats.maxmoney.best = {host: system.host, value: system.maxMoney};
    }
    stats.money.total += system.state.money;
    stats.ram.total += system.maxRam;
    stats.maxmoney.total += system.maxMoney;
  }
  return stats;
}

export function printNetworkStats(process: NPProcess, systems: INPSystem[]) {
  const {ns, log} = process;
  const stats = getNetworkStats(ns, systems);
  log.headline('NP-Network');
  log.wrap(`RootAccess: ${stats.rootAccess}/${stats.systems}`);
  log.wrap(`Network Money: ${hrMoney(stats.money.total)} / ${hrMoney(stats.maxmoney.total)}`);
  log.wrap(`Network Ram: ${hrRam(stats.ram.total)}`);
  log.wrap(`Most Ram: ${stats.ram.best.host} with ${hrRam(stats.ram.best.value)}`);
  log.wrap('Richest: ' + stats.money.best.host + ' with ' + hrMoney(stats.money.best.value));
  log.wrap('Max Richest: ' + stats.maxmoney.best.host + ' with ' + hrMoney(stats.maxmoney.best.value));
  log.line();
  log.headline('Top-Ten-Money', false);
  getTopSystems(systems).forEach(
    (item, index) =>
      log.wrap(` #${index + 1} with: ${hrMoney(item.state.money)}(${hrPercentage(item.state.hackChance)}) is: ${item.host}`,)
  );
  log.line();
  log.headline('Top-Ten-Money (max)', false);
  getTopSystemsMaxMoney(systems).forEach(
    (item, index) =>
      log.wrap(` #${index + 1} with: ${hrMoney(item.maxMoney)} is: ${item.host}`,)
  );
  log.line();
}

export function printNetworkList(process: NPProcess, systems: INPSystem[]) {
  const {ns, log} = process;
  log.setLoggingChars(100);
  log.headline('NP-Network');
  log.value('#  System', 'Rating/Money(Max)/Hack-Chance/Lvl(Ports)(Hackable)');
  systems.forEach(
    (item, index) =>
      log.value(`#${index + 1} ${item.host}`, `(r=${hrMoney(item.state.hackRating)}) `
        + `${hrMoney(item.state.money)}(${hrMoney(item.maxMoney)})/${hrPercentage(item.state.hackChance)}`
        + `/${item.requiredHackingLevel}(${item.requiredPorts})(${item.state.hackable})`
      ));
  log.resetLoggingChars();
}

export async function main(ns: NS) {
  const monitor = new NPProcess(ns, 'Network-Monitor', [
    {name: 'Rating', comment: 'Show Network by Hackrating Score'},
    {name: 'Page', comment: 'Show Page No'}
  ],
                                {});
  await monitor.run(async () => {
    const network = await getNPNetwork(ns);
    if (monitor.args.hasArgument('Rating')) {
      const isPageOne = !monitor.args.hasArgument('page');
      const systems = network
        .sort((a, b) => b.state.hackRating - a.state.hackRating)
        .filter((item, index) => isPageOne ? index <= 35 : index > 35);

      printNetworkList(monitor, systems);
    } else {
      printNetworkStats(monitor, network);
    }
  });
}
