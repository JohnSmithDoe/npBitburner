import {CNPReservedArguments} from 'scripts/model/npArguments';
import {NPProcess} from 'scripts/model/npProcess';
import {CNPServicePortGame, CNPServicePortPlayer, CNPStrategies, TNPServerfarmStrategy} from 'scripts/utils/npConsts';
import {getMaxAffordableServer, getMaxPurchasableServer, getNPServers, hrMoney, hrRam, system2server} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';

async function manageServerfarm(process: NPProcess, strategy: TNPServerfarmStrategy, minRam: number) {
  const {ns, log} = process;

  function buyServer(ram: number) {
    log.info('Purchasing new Server: ', hrRam(ram), ' for ', hrMoney(ns.getPurchasedServerCost(ram)));
    let result = ns.purchaseServer('foo', ram);
    log.toastAssert(!!result.length, 'Purchased a new Server: ', result);
  }

  const affordable = getMaxAffordableServer(ns);
  if (affordable.ram < minRam) {
    log.info(`Not enough money to buy even the smallest server ${hrRam(affordable.ram)}/${hrRam(minRam)})`);
    return false;
  }

  const maxed = getMaxPurchasableServer(ns);
  const systems = await getNPServers(ns, false);
  const servers = systems.map(system => system2server(ns, system))
                         .sort((a, b) => a.ram - b.ram);
  const best = servers.pop();

  switch (strategy) {
    case 'npAffordable':
      buyServer(affordable.ram);
      break;
    case 'npMaxOut':
      if (maxed.ram === affordable.ram) {
        buyServer(maxed.ram);
      }
      break;
    case 'npExponential':
      if (!best) {
        buyServer(minRam);
      } else if ((best.ram === maxed.ram) && (maxed.ram  === affordable.ram)) {
        buyServer(maxed.ram);
      } else if (best.ram * 2 <= affordable.ram) {
        buyServer(best.ram * 2);
      } else {
        log.info('Can not afford next server: ', hrRam(Math.min(best.ram * 2, maxed.ram)), ' for ', hrMoney(ns.getPurchasedServerCost(Math.min(best.ram * 2, maxed.ram))));
      }
      break;
    case 'npLinear':
      if (!best) {
        buyServer(minRam);
      } else if ((best.ram === maxed.ram) || (best.ram + minRam <= affordable.ram)) {
        buyServer(Math.min(best.ram + minRam, maxed.ram));
      } else {
        log.info('Can not afford next server: ', hrRam(best.ram + minRam), ' for ', hrMoney(ns.getPurchasedServerCost(best.ram + minRam)));
      }
      break;
  }
}

/**
 * Buy and upgrade hacknet nodes each second till max reached.
 * @param {NS} ns
 */
export async function main(ns: NS) {
  const actionSettings = CNPStrategies.npManageServerfarm;
  const process = new NPProcess(
    ns, 'Manage Serverfarm Action',
    [
      {name: '_', comment: 'Strategy: ' + actionSettings.options.join('|'), matches: actionSettings.options},
      {name: '__', comment: 'Starting GB for linear or exponential growth'},
    ],
    {feedbackPort: CNPServicePortGame});

  await process.run(() => {
    const strategy = process.args.getWithFallback('_', 'npExponential') as TNPServerfarmStrategy; // TODO: enum
    const min = process.args.asNumber('__', 1024);
    return manageServerfarm(process, strategy, min);
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  const current = args.filter(value => CNPReservedArguments.indexOf(value) < 0);
  if (current.length === 1) {
    return CNPStrategies.npManageServerfarm.options;
  }
}
