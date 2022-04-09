import {NPController} from 'scripts/model/npController';
import {ENPScripts} from 'scripts/utils/npConsts';
import {hasSingularityAPI} from 'scripts/utils/npSingularity';
import {NS} from '../../@types/NetscriptDefinitions';

export async function main(ns: NS) {
  const controller = new NPController(ns, 'Game-Control', [
    {name: '_', comment: 'startup|player|game', matches: ['startup', 'player', 'game']},
    {name: 'mode', comment: 'restart|start|stop', matches: ['start', 'stop', 'restart']},
  ],
                                      {});
  await controller.run(async () => {
    const action = controller.args.getRequired('_') as 'startup' | 'player' | 'game' | 'scrub';

    const service = action === 'player' ? ENPScripts.PlayerService : ENPScripts.GameService;
    const mode = controller.args.getWithFallback('mode', 'restart') as 'start' | 'stop' | 'restart';
    if (action === 'scrub') {
      controller.log.info('Scrubbing Network');
      controller.startProcess(ENPScripts.NukeAndDeploy, ['scrub']);
      return;
    }
    if (action === 'startup') {
      [ENPScripts.HackingMonitor, ENPScripts.NetworkMonitor, ENPScripts.PlayerMonitor, ENPScripts.HacknetMonitor, ENPScripts.FactionsMonitor, ENPScripts.ServerMonitor]
        .forEach(monitor => controller.startMonitor(monitor));
      [ENPScripts.GameService].forEach(service => controller.startService(service));
      if (hasSingularityAPI(ns)) {
        [ENPScripts.PlayerService].forEach(service => controller.startService(service));
      } else {
        controller.log.warn('Singularity API needed for player service to run');
      }
    } else if (mode === 'start') {
      controller.log.info('starting service:', service);
      controller.startService(service);
    } else if (mode === 'stop') {
      controller.log.info('stopping service:', service);
      controller.stopService(service);
    } else if (mode === 'restart') {
      controller.log.info('restarting service:', service);
      controller.restartService(service);
    }
  });
}
