import {NPProcess} from 'scripts/model/npProcess';
import {printFnUsage} from 'scripts/utils/npCheapUtils';
import {CNPServicePortGame, CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {getHacknetMinCosts, getHacknetTotalCost, getHacknetTotalProfit} from 'scripts/utils/npFormulars';
import {getNPPlayer, hrMoney} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';

async function manageHacknet(service: NPProcess, mode: 'bigSpender' | 'profitOnly', startInvestment = 1000) {
  const {ns, log} = service;
  const player = getNPPlayer(ns);
  let investment = 0;
  if (mode === 'bigSpender') {
    investment = getNPPlayer(ns).money - 1e6; // save 1m
  } else {
    const expenses = getHacknetTotalCost(ns);
    const profit = getHacknetTotalProfit(ns);
    investment = profit - expenses + startInvestment;
  }
  while (investment > 0) {
    log.info('Reinvest profit on hacknet: ', hrMoney(investment));
    if (investment > player.money) {
      log.info('Could not reinvest on hacknet: ', hrMoney(investment), ' already spent that money somewhere else');
      return true;
    }
    const minCosts = getHacknetMinCosts(ns);
    if (investment > minCosts.lvlcost) {
      ns.hacknet.upgradeLevel(minCosts.lvlNode, 1);
      investment -= minCosts.lvlcost;
    } else if (investment > minCosts.ramcost) {
      ns.hacknet.upgradeRam(minCosts.ramNode, 1);
      investment -= minCosts.ramcost;
    } else if (investment > minCosts.corecost) {
      ns.hacknet.upgradeCore(minCosts.coreNode, 1);
      investment -= minCosts.corecost;
    } else if (investment > minCosts.nodecost) {
      const idx = ns.hacknet.purchaseNode();
      if (idx > -1) {
        investment -= minCosts.nodecost;
        log.toast('SUCCESS', 'Purchased hacknet Node with index ' + idx);
      } else {
        log.fail('Max Hacknet-Nodes reached');
        return false;
      }
    } else {
      log.info('Could not reinvest on hacknet: ', hrMoney(investment), ' can not afford anything');
      return true;
    }
  }
  return true;
}

/**
 * Buy and upgrade hacknet nodes each second till max reached.
 * @param {NS} ns
 */
export async function main(ns: NS) {
  const process = new NPProcess(
    ns, 'Hacknet-Service',
    [
      {name: 'strategy', comment: 'Can be bigSpender|profitOnly - Spend all your money or spend only the profit made'},
      {name: 'invest', comment: 'Starting Investment Money that can be spend (1k) by default'},
      {name: 'max', comment: 'Maximum number of nodes for bigSpender (9) by default'}
    ],
    {feedbackPort: CNPServicePortGame}
  );

  //TODO: arguments ->handle by class
  const mode = process.args.getWithFallback('strategy', 'profitOnly') as ('bigSpender' | 'profitOnly');
  const invest = process.args.asNumber('invest', 1000);
  const profit = getHacknetTotalProfit(ns);
  if (!mode.length) {
    printFnUsage(process, 'ERROR', 'Manage Hacknet with a strategy');
    return;
  }
  await process.run(() => manageHacknet(process, mode));

}
