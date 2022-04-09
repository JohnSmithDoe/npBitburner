import {NPProcess} from 'scripts/model/npProcess';
import {CNPPathSeperator} from 'scripts/utils/npConsts';
import {getNPPlayer, mapHostToNPSystem} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPSystem, TNPLogLevel, TNPScanFn} from '../../@types/npTypes';

/**
 * Full File RAM
 * 1.6GB for base cost
 * 0.2GB for ns.scan
 */

//<editor-fold desc="*** Scan the Network Recursively ***">

/**
 * RAM cost 0.2 for ns.scan
 */
async function scanNext(ns: NS, host: string, onScan: TNPScanFn, path: string[], all: string[]) {
  if (all.indexOf(host) === -1) {
    all.push(host);
    path.push(host);
    await onScan(host, path);
    const hosts = ns.scan(host);
    for (let subhost of hosts) {
      await scanNext(ns, subhost, onScan, path, all);
    }
    path.pop();
  }
}

export async function scanNetwork(ns: NS, onScan: TNPScanFn) {
  return scanNext(ns, 'home', onScan, [], []);
}

//</editor-fold>
export function printFnUsage(process: NPProcess, lvl: TNPLogLevel, comment: string) {
  const {log, params} = process;
  log.wrap(process.args.toString(), lvl);
  log.headline('Fn-Usage', true, lvl);
  log.wrap(comment, lvl);
  for (const param of params) {
    log.wrap(`${param.name}${param.required ? '' : '?'} - ${param.comment}`, lvl);
  }
  log.line(lvl);
}

export async function getNetworkPath(ns: NS, host: string): Promise<string|false> {
  let result: string|boolean = false;
  await scanNetwork(ns, async (ahost, path) => {
    if(ahost === host) result = path.join(CNPPathSeperator);
  });
  return result;
}
