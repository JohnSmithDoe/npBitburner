import {NPService} from 'scripts/model/npController';
import {CNPServicePortGame, ENPHackingActions, ENPNetworkActions, ENPScripts} from 'scripts/utils/npConsts';
import {NS} from '../../@types/NetscriptDefinitions';


/**
 * TODO:RAM management keep this small make the controllers bigger i guess
 * TODO: integrate feedback logging via port
 * @param {NS} ns
 */
export async function main(ns: NS) {

  const service = new NPService(ns, 'npGame-Service', [], CNPServicePortGame);
  await service.run(async () => {
    if (!service.hasTasks()) {
      service.queueIn( ENPScripts.NukeAndDeploy, [ENPNetworkActions.nukeNetwork]);
      service.queueIn( ENPScripts.ManageHacknet, ['profitOnly']);
      service.queueIn( ENPScripts.ManageHacking, [ENPHackingActions.attack]);
      service.queueIn( ENPScripts.ManageServerfarm, ['npExponential']);
      service.queueIn( ENPScripts.SolveContracts, []);
    }
    service.handleTask();
  });
}
