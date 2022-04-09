import {CNPServicePortPlayer, ENPScripts} from 'scripts/utils/npConsts';
import {NPSingularityController} from 'scripts/utils/npSingularity';
import {getBackdoorable, getNPNetwork} from 'scripts/utils/npUtils';
import {NS} from '../../../@types/NetscriptDefinitions';


// TODO: logging
export async function main(ns: NS) {
  const action = new NPSingularityController(
    ns, 'Manage Network Action',
    [],
    {feedbackPort: CNPServicePortPlayer}
  );

  await action.run(async () => {
    const network = await getNPNetwork(ns);
    const installBackdoors = getBackdoorable(network).map(system => system.host);
    action.log.warn('Installing Backdoors on ' + installBackdoors.length + ' systems');
    installBackdoors.forEach(host => action.startProcess(ENPScripts.InstallBackdoor, [host]));
  });
}
