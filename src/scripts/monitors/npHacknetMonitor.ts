import {NPProcess} from 'scripts/model/npProcess';
import {getHacknetNodeTotalCost, getHacknetTotalCost} from 'scripts/utils/npFormulars';
import {hrMoney} from 'scripts/utils/npUtils';
import {NodeStats, NS} from '../../@types/NetscriptDefinitions';

export function printHacknet(process: NPProcess) {
  const {ns, log} = process;
  const stats: NodeStats[] = [];
  let totalExpenses = getHacknetTotalCost(ns);
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    const nodeStats = ns.hacknet.getNodeStats(i);
    stats.push(nodeStats);
  }
  log.headline('Hacknet (#' + stats.length + ')');
  const totalProfit = stats.reduce((prev, current) => prev + current.totalProduction, 0);
  const totalProfitSec = stats.reduce((prev, current) => prev + current.production, 0);
  log.value('Profit-Total', `${hrMoney(totalProfit - totalExpenses)}`);
  log.value('Profit/Costs', `${hrMoney(totalProfit)} (${hrMoney(totalProfitSec)}/s)/${hrMoney(totalExpenses)}`);
  log.line();
  stats.forEach((node, index) => {
    const istr = (index + '').padEnd(2);
    const costs = getHacknetNodeTotalCost(ns, index, node);
    log.wrap(`node-${istr} Lvl: ${(node.level + '').padEnd(8, ' ')} RAM: ${(node.ram + 'GB').padEnd(10, ' ')} Cores: ${node.cores}`);
    log.value(`node-${istr} Profit`, `${hrMoney(node.totalProduction)} (${hrMoney(node.production)}/s)/${hrMoney(costs.total)}/${hrMoney(node.totalProduction - costs.total)}`);
    log.line();
  });
}

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Hacknet-Monitor', [],
                                {});
  await process.run(async () => {
    printHacknet(process);
  });
}
