import {NS} from '../../@types/NetscriptDefinitions';

export function getHacknetNodeTotalCost(ns, index, stats) {
  const player = ns.getPlayer();

  let nodeCost= (idx) => 1000 * Math.pow(1.85, idx) * player.hacknet_node_purchase_cost_mult;
  let ramCost = (ram) =>  (ram * 30e3) * Math.pow(1.28, Math.log2(ram)) * player.hacknet_node_ram_cost_mult;
  let coreCost = (cores) => (500e3 * Math.pow(1.48,cores-1)) * player.hacknet_node_core_cost_mult;
  let lvlCost = (level) => (500 * Math.pow(1.04, level)) * player.hacknet_node_level_cost_mult;
  let result = {nodeCost:nodeCost(index),lvlCost: 0,ramCost: 0,coreCost:0,total: -1 };
  for(let lvl = 1; lvl < stats.level; lvl++){
    result.lvlCost += lvlCost(lvl);
  }
  for(let core = 1; core < stats.cores; core++){
    result.coreCost += coreCost(core);
  }
  for(let ram = 1; ram < stats.ram; ram *=2){
    result.ramCost += ramCost(ram);
  }

  result.total = result.nodeCost + result.lvlCost + result.ramCost + result.coreCost;
  return result;
}
export function getHacknetTotalCost(ns:NS){
  let totalExpenses = 0;
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    const totalCost = getHacknetNodeTotalCost(ns, i, ns.hacknet.getNodeStats(i));
    totalExpenses += totalCost.total;
  }
  return totalExpenses;
}
export function getHacknetTotalProfit(ns:NS){
  let totalProfit = 0
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    const stats = ns.hacknet.getNodeStats(i);
    totalProfit += stats.totalProduction;
  }
  return totalProfit;
}
export function getHacknetMinCosts(ns:NS){
  const minCosts = {
    lvlcost:   Infinity,
    lvlNode: -1,
    ramcost:   Infinity,
    ramNode: -1,
    corecost : Infinity,
    coreNode: -1,
    nodecost : ns.hacknet.getPurchaseNodeCost()
  };
  for (let i = 0; i < ns.hacknet.numNodes(); i++) {
    const lvlcost = ns.hacknet.getLevelUpgradeCost(i, 1);
    if(lvlcost < minCosts.lvlcost){
      minCosts.lvlcost = lvlcost;
      minCosts.lvlNode = i;
    }
    const ramcost = ns.hacknet.getRamUpgradeCost(i, 1);
    if(ramcost < minCosts.ramcost){
      minCosts.ramcost = ramcost;
      minCosts.ramNode = i;
    }
    const corecost = ns.hacknet.getCoreUpgradeCost(i, 1);
    if(corecost < minCosts.corecost){
      minCosts.corecost = corecost;
      minCosts.coreNode = i;
    }
  }
  return minCosts;
}
