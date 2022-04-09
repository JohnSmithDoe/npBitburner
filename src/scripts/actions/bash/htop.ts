import {NPProcess} from 'scripts/model/npProcess';
import {NS} from '../../../@types/NetscriptDefinitions';

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Process-Monitor', [
    {name: 'host', comment: 'Target Host'},
  ], {timer: 500});
  const host = process.args.getWithFallback('_', 'home');
  await process.run(async () => {
    process.log.headline(process.name);
    ns.ps(host).forEach(p => {
      process.log.value(`(${p.pid}):${p.filename}`, 't=' + p.threads);
    });
    process.log.line();
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  return data.servers;
}
