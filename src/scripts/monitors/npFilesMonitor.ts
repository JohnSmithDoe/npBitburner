import {CNPReservedArguments} from 'scripts/model/npArguments';
import {NPProcess} from 'scripts/model/npProcess';
import {CNPMonitors, TNPFilesMonitorSettings} from 'scripts/utils/npConsts';
import {hrRam, scriptDetail} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';


export function printFileSystem(process: NPProcess, fileSystem: { host: string; files: string[] }[], asList?: boolean) {
  const {ns, log} = process;
  if (asList) log.line();
  for (const system of fileSystem) {
    if (!asList) {
      log.line();
      log.wrap('Files on System: ' + system.host);
    }
    for (const file of system.files) {
      log.wrap(system.host + ': ' + file);
    }
    if (!asList) {
      log.line();
      log.info('');
    }
  }
  if (asList) log.line();
}

export function printScripts(process: NPProcess, host: string) {
  const {ns, log} = process;
  log.headline('Scripts on ' + host);
  ns.ls(host, '.js')
    .map(filename => Object.assign({script: filename}, scriptDetail(ns, filename, host)))
    .sort((a, b) => b.usage - a.usage)
    .forEach(data => log.wrap(data.script + ': ' + hrRam(data.usage)));
  log.line();
}

export function printBooks(process: NPProcess, host: string) {
  const {ns, log} = process;
  log.headline('Books on ' + host);
  ns.ls(host, '.lit').forEach(data => log.wrap(data));
  log.line();
}

export function printContracts(process: NPProcess, host: string) {
  const {ns, log} = process;
  log.headline('Contracts on ' + host);
  ns.ls(host, '.cct').forEach(data => log.wrap(data));
  log.line();
}

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Files-Monitor', [
      {name: '_',  comment: CNPMonitors.npFiles.options.join('|'), required: true, matches: CNPMonitors.npFiles.options},
      {name: '__',  comment: 'Target Host'},
  ],
                                {});
  const mode = process.args.getWithFallback('_', CNPMonitors.npFiles.fallback, CNPMonitors.npFiles.options) as TNPFilesMonitorSettings;
  const host = process.args.getWithFallback('__', 'home');
  await process.run(async () => {
    switch (mode){
      case 'npScripts':
          printScripts(process, host);
        break;
      case 'npBooks':
          printBooks(process, host);
        break;
      case 'npContracts':
          printContracts(process, host);
        break;
    }
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  const current = args.filter(value => CNPReservedArguments.indexOf(value) < 0);
  if (current.length === 1) {
    return CNPMonitors.npFiles.options;
  }
  return data.servers;
}
