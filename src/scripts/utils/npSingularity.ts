import {NPController} from 'scripts/model/npController';
import {NPProcess} from 'scripts/model/npProcess';
import {CNPPathSeperator} from 'scripts/utils/npConsts';
import {NS} from '../../@types/NetscriptDefinitions';
import {TNPAction} from '../../@types/npTypes';

export function hasSingularityAPI(ns: NS) {
  let bitNodeExposed = false;
  try {
    ns.getCurrentServer();
    bitNodeExposed = true;
  } catch (err) {
    ns.tprint('WARN Bitnode 4 needed for Singularity-API');
  }
  return bitNodeExposed;
}

export function connectTo(ns: NS, path: string) {
  let result = true;
  path.split(CNPPathSeperator).forEach(host => result = ns.connect(host) && result);
  return result;
}

export class NPSingularityProcess extends NPProcess {
  async run(action: TNPAction): Promise<void> {
    if (hasSingularityAPI(this.ns)) {
      await super.run(action);
    } else {
      this.log.warn('This only works with soure file no 4 (Singularity-Api)');
    }
  }
}
export class NPSingularityController extends NPController {
  async run(action: TNPAction): Promise<void> {
    if (hasSingularityAPI(this.ns)) {
      await super.run(action);
    } else {
      this.log.warn('This only works with soure file no 4 (Singularity-Api)');
    }
  }
}
