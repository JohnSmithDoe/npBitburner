import {connectTo, NPSingularityController} from 'scripts/utils/npSingularity';
import {getNPNetwork} from 'scripts/utils/npUtils';
import {NS} from '../../../@types/NetscriptDefinitions';

/**
 * Todo comment
 */
export async function main(ns: NS) {
  const action = new NPSingularityController(
    ns, 'ConnectTo',
    [{name: '_', comment: 'Hostname to connect to (autocomplete)', required: true}],
    {}
  );
  await action.run(async () => {
    const network = await getNPNetwork(ns);
    let host = action.args.getRequired('_');
    const system = network.find(node => node.host === host);
    if (system) {
      connectTo(ns, system.path);
    } else {
      action.log.warn('Host not found: ', host);
    }
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  return data.servers;
}
