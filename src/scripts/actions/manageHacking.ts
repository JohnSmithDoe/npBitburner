import {CNPReservedArguments} from 'scripts/model/npArguments';
import {NPProcess} from 'scripts/model/npProcess';
import {CNPHackingActions, CNPServicePortGame, ENPHackingActions, ENPScripts, ENPVirusModes, TNPVirusProcess} from 'scripts/utils/npConsts';
import {getHackable, getNPHome, getNPNetwork, getNPServers, getVirusProcesses, getVirusRunnable, isRunningVirus} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPSystem} from '../../@types/npTypes';


function killRunningViruses(process: NPProcess, system: INPSystem, exceptions: TNPVirusProcess[]) {
  const {ns, log} = process;
  getVirusProcesses(ns, system).forEach(process => {
    const isException = exceptions.find(target => (target.target === process.target) && (target.threads === process.threads) && (target.mode === process.mode));
    if (!isException && process.pid) {
      log.debug('Killing Process: ', process);
      ns.kill(process.pid);
    } else {
      log.debug('NOT Killing process', process);
    }
  });
}

function startRunningVirusProcesses(process: NPProcess, system: INPSystem, processes: TNPVirusProcess[]) {
  const {ns, log} = process;
  processes.forEach(process => {
    if (!isRunningVirus(ns, system, process.target, process.threads, process.mode) && (process.threads > 0)) {
      if (ns.exec(ENPScripts.Virus, system.host, process.threads, ...['--target=' + process.target, '--mode=' + process.mode])) {
        log.debug('Started Virus: ', process, system.host);
      } else {
        log.debug('Could not start Process: ', process, system.host);
      }
    } else {
      log.debug('Already running Process: ', process, system.host);
    }
  });
}

function updateAttack(process: NPProcess, system: INPSystem, targets: TNPVirusProcess[]) {
  const {ns, log} = process;
  log.debug('Updating Attack on ', system.host, ' with ', targets);
  killRunningViruses(process, system, targets);
  startRunningVirusProcesses(process, system, targets);
}

function getLoadBalancing(process: NPProcess, attackingSystems: INPSystem[], targetSystems: INPSystem[]) {
  const {ns, log} = process;
  const result: Map<INPSystem, INPSystem[]> = new Map<INPSystem, INPSystem[]>();
  // let best = targetSystems.shift();
  // let best2 = targetSystems.shift();
  // if (best) targetSystems = [best];
  // if (best2) targetSystems.push(best2);

  function sortAttackingSystems() {
    attackingSystems.sort((a, b) => {
      const atargetCount = (result.get(a)?.length || 0) + 1;
      const btargetCount = (result.get(b)?.length || 0) + 1;
      return (b.threads / btargetCount) - (a.threads / atargetCount);
    });
  }

  for (const targetSystem of targetSystems) {
    sortAttackingSystems();
    const server = attackingSystems[0];
    const config: INPSystem[] = (result.get(server) || []);
    config.push(targetSystem);
    result.set(server, config);
  }
  return result;
}

async function manageNetwork(process: NPProcess) {
  const {ns, log}    = process,
        network      = await getNPNetwork(ns),
        targets      = getHackable(network).filter(target => target.maxMoney > 0)
                                           .sort((a, b) => b.maxMoney - a.maxMoney),
        servers      = await getNPServers(ns, false),
        home         = getNPHome(ns),
        attackers    = [...getVirusRunnable(ns, network), ...servers, home],
        attackConfig = getLoadBalancing(process, attackers, targets),
        xtraCapacity = attackers.filter(system => !attackConfig.has(system));

  for (const attacker of attackConfig.keys()) {
    const setup: TNPVirusProcess[] = [];
    log.info('attacker: ', attacker.host);
    const atargets = attackConfig.get(attacker) || [];
    let usedThreads = 0;
    for (let i = 0; i < atargets.length; i++) {
      const target = atargets[i];
      log.info(target.host);
      let threads = Math.trunc(attacker.threads / atargets.length);
      usedThreads += threads;
      if(i === atargets.length-1){
        threads += attacker.threads - usedThreads;
      }
      setup.push({target: target.host, mode: ENPVirusModes.drainSystem, threads});
    }
    updateAttack(process, attacker, setup);
  }
  const topSystem = targets.sort((a, b) => a.requiredHackingLevel - b.requiredHackingLevel).pop();
  if (topSystem) {
    for (const xpGenerator of xtraCapacity) {
      log.info('XP on ', xpGenerator.host);
      updateAttack(process, xpGenerator, [{target: topSystem.host, threads: xpGenerator.threads, mode: ENPVirusModes.generateXP}]);
    }
  }
}


export async function main(ns: NS) {
  const process = new NPProcess(
    ns, 'Hacking-Controller',
    [{name: '_', comment: 'Action: ' + CNPHackingActions.join('|'), matches: CNPHackingActions}],
    {feedbackPort: CNPServicePortGame}
  );
  await process.run(async () => {
    const action = process.args.getRequired<ENPHackingActions>('_');
    switch (action) {
      default:
        await manageNetwork(process);
    }
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  const current = args.filter(value => CNPReservedArguments.indexOf(value) < 0);
  if (current.length === 1) {
    return CNPHackingActions;
  }
}
