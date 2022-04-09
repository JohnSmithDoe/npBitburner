import {NPProcess} from 'scripts/model/npProcess';
import {NS} from '../@types/NetscriptDefinitions';

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Test-File', [], {});
  process.log.info('');
}
