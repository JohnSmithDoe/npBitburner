import {NPProcess} from 'scripts/model/npProcess';
import {CNPAllPrograms} from 'scripts/utils/npBitburner';
import {getCurrentTask, taskToTxt} from 'scripts/utils/npStrategy';
import {getMaxAffordableServer, getMaxPurchasableServer, getNPPlayer, getNPServers, hrMoney, hrRam} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';

export async function printPlayerStats(process: NPProcess) {
  const {ns, log} = process;
  const player = getNPPlayer(ns);
  const currentTask = await getCurrentTask(process);
  log.headline('Player Stats');
  log.wrap('Name: ' + player.name);
  log.wrap(`Recommended Action: ${currentTask.type}`);
  log.wrap(`${taskToTxt(currentTask)}`);
  log.wrap(`IsBusy/IsFocused: ${ns.isBusy()}/${ns.isFocused()}`);
  log.wrap(`Could backdoor systems: ${currentTask.installBackdoors}}`);

  log.headline('Owned Stuff', false);
  log.wrap(`Tor Router: ${player.tor}`);
  for (const program of CNPAllPrograms) {
    log.wrap(`${program}: ${ns.fileExists(program)}`);
  }
  const csec = ns.getServer('CSEC');
  const nitesec = ns.getServer('avmnite-02h');
  const blackhand = ns.getServer('I.I.I.I');
  const bitrunners = ns.getServer('run4theh111z');

  log.headline('Faction Backdoors', false);
  log.wrap('Backdoor on CSEC      : ' + csec.backdoorInstalled);
  log.wrap('Backdoor on Nitesec   : ' + nitesec.backdoorInstalled);
  log.wrap('Backdoor on Blackhand : ' + blackhand.backdoorInstalled);
  log.wrap('Backdoor on Bitrunners: ' + bitrunners.backdoorInstalled);
  log.line();
}

export async function printGameStats(process: NPProcess) {
  const {ns, log} = process;
  const data = getMaxPurchasableServer(ns);
  const data2 = getMaxAffordableServer(ns);
  const serverfarm = await getNPServers(ns, false);
  // const serverThreads = serverfarm.reduce((prev, current) => prev + getMaxPossibleVirusThreads(ns, current.host), 0);
  const serverThreads = -1;
  log.headline('Serverfarm');
  log.value('Servers', `${serverfarm.length}(t=${serverThreads})`);
  log.value('Server cost', `${hrRam(data.ram)} - ${hrMoney(data.cost)}`);
  log.value('Server cost', `${hrRam(data2.ram)} - ${hrMoney(data2.cost)} (affordable)`);
  log.line();
}

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Player-Monitor', [],
                                {});
  await process.run(async () => {
   await printPlayerStats(process);
   await printGameStats(process);
  });
}
