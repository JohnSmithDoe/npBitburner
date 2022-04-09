import {getNetworkPath} from 'scripts/utils/npCheapUtils';
import {connectTo, NPSingularityController} from 'scripts/utils/npSingularity';
import {NS} from '../../../@types/NetscriptDefinitions';

export async function main(ns: NS) {
  const process = new NPSingularityController(
    ns, 'Install Backdoors',
    [{name: '_', comment: 'Host to backdoor on', required: true}],
    {}
  );
  await process.run(async () => {
    const {log} = process,
          host  = process.args.getRequired('_'),
          path  = await getNetworkPath(ns, host);
    if (path) {
      log.toast('WARN', 'Installing backdoor on: ', host);
      const connected = connectTo(ns, path);
      log.assert(connected, 'Connected to: ', host);
      if (connected) {
        await ns.installBackdoor();
        connectTo(ns, 'home');
        log.toast('SUCCESS', 'Installed backdoor on: ', host);
      }
    }
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  return data.servers;
}
