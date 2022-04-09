import {CNPReservedArguments} from 'scripts/model/npArguments';
import {NPController} from 'scripts/model/npController';
import {CNPMonitors, TNPMonitorType} from 'scripts/utils/npConsts';
import {NS} from '../../@types/NetscriptDefinitions';

export async function main(ns: NS) {
  const types = Object.keys(CNPMonitors) as TNPMonitorType[];

  const controller = new NPController(ns, 'Monitor-Controller', [
    {name: '_', comment: types.join('|'), required: true, matches: types},
    {name: '__', comment: 'optional settings'},
    {name: '___', comment: 'host filter'},
  ],
                                      {});
  const monitor = controller.args.getOptional('_') as TNPMonitorType;

  await controller.run(async () => {
    let args: string[] = [];
    switch (monitor) {
      case 'npFiles':
        args = [
          controller.args.getWithFallback('__', CNPMonitors.npFiles.fallback, CNPMonitors.npFiles.options),
          controller.args.getWithFallback('___', 'home')
        ];
        break;
      case 'npContracts':
        const grep = controller.args.getOptional('__');
        if(grep) args = [grep];
        break;
      case 'npSystem':
        const host = controller.args.getOptional('__');
        if(host) args = [host];
        break;
      case 'npFaction':
      case 'npHacking':
      case 'npNetwork':
      case 'npPlayer':
      case 'npHacknet':
    }
    controller.startMonitor(CNPMonitors[monitor].monitor, args);
  });

}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  const current = args.filter(value => CNPReservedArguments.indexOf(value) < 0);
  if (current.length === 1) {
    return Object.keys(CNPMonitors);
  } else if (current.length === 2) {
    const settings = CNPMonitors[current[0]]?.options || [];
    return !!settings.length ? settings : data.servers;
  }
  return data.servers;
}
