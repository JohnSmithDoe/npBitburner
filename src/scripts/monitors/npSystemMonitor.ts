import {NPArguments} from 'scripts/model/npArguments';
import {NPProcess} from 'scripts/model/npProcess';
import {CNPHackThreshMoneyMaintain} from 'scripts/utils/npConsts';
import {getNPPlayer, hrMoney, hrPercentage, hrRam, mapHostToNPSystem} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPPlayer, INPSystem} from '../../@types/npTypes';


export function printHost(process: NPProcess, system: INPSystem, player: INPPlayer) {
  const {log} = process;
  const moneyThresh = hrMoney(system.maxMoney * CNPHackThreshMoneyMaintain);
  const state = system.state.rootAccess ? 'Has Root Access: true' : ('Nukeable: ' + system.state.nukeable);
  const msg = [
    'RAM: ' + hrRam(system.maxRam),
    'Money: ' + hrMoney(system.state.money) + ' / ' + hrMoney(system.maxMoney) + ' / ' + moneyThresh,
    state,
    'Hackable: ' + system.state.hackable,
    'Hacking Chance: ' + hrPercentage(system.state.hackChance),
    'Hacking Level: ' + player.hackingLevel + '/' + system.requiredHackingLevel,
    'Hacking Ports: ' + player.hackingPorts + '/' + system.requiredPorts,
    '--------------------------------',
  ];
  log.headline('Host ' + system.host);
  for (const line of msg) {
    log.wrap(line);
  }
  log.line();
}

export async function main(ns: NS) {
  const process = new NPProcess(ns, 'Host-Monitor', [
    {name: '_', comment: 'Target Host (autocomplete)', required: true},
  ],
                                {});
  await process.run(async () => {
    const host = process.args.getWithFallback(NPArguments.UNNAMED, 'home');
    const player = getNPPlayer(ns);
    const system = mapHostToNPSystem(ns, host, ['not calculated'], player);
    printHost(process, system, player);
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  return data.servers;
}
