import {CNPCityFactions, ENPFactions} from 'scripts/utils/npBitburner';
import {CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {NPSingularityController} from 'scripts/utils/npSingularity';
import {NS} from '../../../@types/NetscriptDefinitions';

// TODO: logging
export async function main(ns: NS) {
  const action = new NPSingularityController(ns, 'Install Backdoors-Controller', [], {feedbackPort: CNPServicePortPlayer});

  await action.run(async () => {
    const factions = ns.checkFactionInvitations().filter(faction => CNPCityFactions.indexOf(faction as ENPFactions) < 0);
    action.log.warn('Factions to join: ' + factions);
    factions.forEach(faction => action.log.toastAssert(ns.joinFaction(faction), 'Join Faction: ' + faction));
  });
}
