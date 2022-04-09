import {CNPFactions, ENPFactions} from 'scripts/utils/npBitburner';
import {CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {NPSingularityController} from 'scripts/utils/npSingularity';
import {checkAugmentations} from 'scripts/utils/npStrategy';
import {NS} from '../../../@types/NetscriptDefinitions';

// process.startController(ENPScripts.StudyAction, [
//   'university='+(task as INPTask<TNPCourse>).data.university,
//   'course='+(task as INPTask<TNPCourse>).data.course
// ]);
//
// process.startController(ENPScripts.CreateProgramAction, [(task as INPTask<string>).data]);

// TODO: woot
export async function main(ns: NS) {
  const action = new NPSingularityController(ns, 'Manage Player', [],
                                             {feedbackPort: CNPServicePortPlayer});
  const faction = checkAugmentations(action) as ENPFactions.NiteSec | ENPFactions.CyberSec | false;
  if (faction) {
    action.log.info('Player should work for ', faction);
   // ns.workForFaction(faction, CNPFactions[faction].work[0], true);

  } else {
    action.log.info('Player can do what ever he wants');
  }
}
