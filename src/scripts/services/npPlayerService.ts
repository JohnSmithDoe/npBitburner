import {NPService} from 'scripts/model/npController';
import {CNPServicePortPlayer, ENPScripts} from 'scripts/utils/npConsts';
import {hasSingularityAPI} from 'scripts/utils/npSingularity';
import {NS} from '../../@types/NetscriptDefinitions';

/**
 * // ram management
 * // start contracts service if there are contracts available only do not cron
 * // to start processes kill npMonitor if needed or other ones -> do not kill hacking service i guess
 */
export async function main(ns: NS) {
  const service = new NPService(ns, 'npPlayer-Service', [], CNPServicePortPlayer);
  if (hasSingularityAPI(ns)) {
    await service.run(async () => {
      if (!service.hasTasks()) {
        service.queueIn( ENPScripts.ManageNetwork, []);
        service.queueIn( ENPScripts.ManageFactions, []);
        service.queueIn( ENPScripts.ManagePossessions, []);
        service.queueIn( ENPScripts.ManageAugmentations, []);
        service.queueIn( ENPScripts.ManagePlayer, []);
      }
      service.handleTask();
      service.reportFeedback();
    });
  }else {
    service.log.info('Singularity not exposed -> You should use the npPlayerMonitor to help you');
    service.startMonitor(ENPScripts.PlayerMonitor)
  }
}
