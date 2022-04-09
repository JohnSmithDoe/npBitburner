import {CNPProgramStats, CNPTorRouter, ENPPrograms} from 'scripts/utils/npBitburner';
import {CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {NPSingularityController} from 'scripts/utils/npSingularity';
import {getNPPlayer, hrMoney, hrRam} from 'scripts/utils/npUtils';
import {NS} from '../../../@types/NetscriptDefinitions';

// TODO: logging
export async function main(ns: NS) {
  const action = new NPSingularityController(ns, 'Manage Possessions', [],
                                             {feedbackPort: CNPServicePortPlayer});
  await action.run(async () => {
    // Buy more RAM
    const homeRam = ns.getServerMaxRam('home');
    action.log.info('Home Ram: ' , hrRam(homeRam), ' next update cost: ', hrMoney(ns.getUpgradeHomeRamCost()));
    //ns.upgradeHomeRam();
    // Buy Tor Router
    const player = getNPPlayer(ns);
    if(!player.tor){
      if(player.money > CNPTorRouter.cost) ns.purchaseTor();
    }
    // Buy Programs
    for(const key in ENPPrograms ){
      const program = ENPPrograms[key];
      if(player.files.indexOf(program)< 0){
        if(CNPProgramStats[program].price < player.money){
          action.log.toastAssert(ns.purchaseProgram(program), 'Purchased Program ', program);
        }
      }
    }
    // Buy more RAM/Cores ?
  });
}
