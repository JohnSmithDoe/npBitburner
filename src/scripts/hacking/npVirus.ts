import {ENPVirusModes} from 'scripts/utils/npConsts';
import {NS} from '../../@types/NetscriptDefinitions';

/** @param {NS} ns **/
export async function main(ns: NS) {
  const data = ns.flags([
                          ['target', ''],
                          ['mode', 'npGenerateXP'],
                        ]);

  const target: string = data.target;
  const mode: ENPVirusModes = data.mode;
  let serverMaxMoney = mode === ENPVirusModes.drainSystem ? 0 : ns.getServerMaxMoney(target);
  //ns.disableLog('ALL');
  // noinspection InfiniteLoopJS
  while (true) {
    const now = new Date();
    ns.print(now.toLocaleTimeString(), ' - Target: ', target, ' Mode: ', mode);
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
      ns.print('Calling weaken: ', ns.getWeakenTime(target));
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < serverMaxMoney) {
      ns.print('Calling grow: ', ns.getGrowTime(target));
      await ns.grow(target);
    } else {
      if (mode === ENPVirusModes.generateXP) {
        ns.print('Calling weaken instead of hack to generate xp');
        await ns.weaken(target);
      } else {
        ns.print('Calling hack: ', ns.getHackTime(target));
        await ns.hack(target);
      }
    }
    await ns.sleep(500);
  }
}
