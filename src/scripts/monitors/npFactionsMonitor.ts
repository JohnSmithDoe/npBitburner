import {NPProcess} from 'scripts/model/npProcess';
import {ENPFactions} from 'scripts/utils/npBitburner';
import {getOwnedAugmentations} from 'scripts/utils/npNetscript';
import {checkFactionRequirements} from 'scripts/utils/npStrategy';
import {getFactions, getNPPlayer, hrMoney, hrNumber} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPAugmentation} from '../../@types/npTypes';

export function printAugmentations(process: NPProcess, grep?: string) {
  const {ns, log} = process;
  const factions = getFactions(ns);
  const ownedAugmentations = getOwnedAugmentations(ns,true);

  const allAugs = factions
    .reduce((all, faction) => {
      faction.augs
             .filter(faug => !all.find(aug => faug.name === aug.name))
             .filter(faug => !ownedAugmentations.find(paug => faug.name === paug))
             .forEach(faug => all.push(faug));
      return all;
      }, [] as INPAugmentation[]);
    // .sort((a, b) => a.name.localeCompare(b.name));
  log.setLoggingChars(100);
  log.headline('Available Augmentations');
  log.value('Name','Faction Rep./Reputation/Price/Owned/CanBuy');
  const player = getNPPlayer(ns);
  for (const aug of allAugs) {
    const factionRep = ns.getFactionRep(aug.faction);
    const owned = ownedAugmentations.indexOf(aug.name) >= 0;
    const canBuy = !owned && aug.reputation <= factionRep && aug.price < player.money;
    log.value(aug.faction + ': ' + aug.name, `${hrNumber(factionRep)}/${hrNumber(aug.reputation)}/${hrMoney(aug.price)}/${owned}/${canBuy}`);
  }
  log.resetLoggingChars();

  // log.headline('Factions');
  // for (const {faction, augs} of factions) {
  //   log.value('Faction', faction);
  //   log.value('Augmentations', augs.length + '');
  //   augs.forEach(aug => {
  //     log.wrap(aug.name);
  //     log.value('Price/Reputation/Owned', `${hrMoney(aug.price)}/${hrMoney(aug.reputation)}/??`);
  //   });
  //   log.line();
  // }
}

function printFactions(monitor: NPProcess, grep: string | undefined) {
  monitor.log.line();
  const joined = monitor.ns.getPlayer().factions
  for(let key in ENPFactions){
    const faction = ENPFactions[key];
    if(joined.indexOf(faction) >=0 ){
      monitor.log.success(`${faction}(${hrNumber(monitor.ns.getFactionRep(faction))}) already joined`);
    }else{
      const canJoin = checkFactionRequirements(monitor.ns, faction);
      monitor.log.assert(canJoin,faction + ' requirements met');
    }


  }
  monitor.log.line();
}

export async function main(ns: NS) {
  const monitor = new NPProcess(
    ns, 'Factions-Monitor',
    [{name: '_', comment: 'Grep by faction name'}],
    {}
  );
  const grep = monitor.args.getOptional('_');
  await monitor.run(async () => {
    printFactions(monitor, grep);
    printAugmentations(monitor, grep);
  });
}

