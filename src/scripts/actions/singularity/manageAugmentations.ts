import {NPProcess} from 'scripts/model/npProcess';
import {ENPAugmentations} from 'scripts/utils/npBitburner';
import {CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {getOwnedAugmentations} from 'scripts/utils/npNetscript';
import {NPSingularityController} from 'scripts/utils/npSingularity';
import {checkAugmentations} from 'scripts/utils/npStrategy';
import {getFactions, getNPPlayer} from 'scripts/utils/npUtils';
import {NS} from '../../../@types/NetscriptDefinitions';
import {INPAugmentation} from '../../../@types/npTypes';

export function buyAugmentations(process: NPProcess) {
  const {ns, log} = process;
  const factions = getFactions(ns);
  checkAugmentations(process);
  const ownedAugmentations = getOwnedAugmentations(ns, true);
  const allAugs = factions
    .reduce((all, faction) => {
      faction.augs
             .filter(faug => !all.find(aug => faug.name === aug.name))
             .filter(faug => !ownedAugmentations.find(paug => faug.name === paug))
             .forEach(faug => all.push(faug));
      return all;
    }, [] as INPAugmentation[])
  .sort((a, b) => b.price - a.price);
  const player = getNPPlayer(ns);
  for (const aug of allAugs) {
    const factionRep = ns.getFactionRep(aug.faction);
    const owned = ownedAugmentations.indexOf(aug.name) >= 0;
    const canBuy = !owned && aug.reputation <= factionRep && aug.price < player.money;
    if(canBuy && aug.name !== ENPAugmentations.NeuroFluxGovernor){
      log.toastAssert(ns.purchaseAugmentation(aug.faction, aug.name), 'Purchased Augmentation: ' + aug.name);
    }
  }
}

export async function main(ns: NS) {
  const action = new NPSingularityController(ns, 'Manage Possessions', [], {feedbackPort: CNPServicePortPlayer});
  await action.run(async () => {
    // Buy augmentations
    buyAugmentations(action);
  });
}
