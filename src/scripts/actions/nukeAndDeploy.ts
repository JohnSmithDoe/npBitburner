import {CNPReservedArguments} from 'scripts/model/npArguments';
import {NPProcess} from 'scripts/model/npProcess';
import {CNPNetworkActions, CNPServicePortGame, CNPVirusfiles, ENPNetworkActions} from 'scripts/utils/npConsts';
import {deploy, openSystems, scrub} from 'scripts/utils/npNetscript';
import {getDeployable, getDeployed, getNPNetwork, getNPServers, getNukeable} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';


async function nukeNetwork(process: NPProcess) {
  const {ns, log} = process;
  let network = await getNPNetwork(ns); // TODO: RAM
  const nukeables = getNukeable(network);
  if (nukeables.length) {
    log.success('Found (', nukeables.length, ') systems that can be nuked');
    openSystems(process, nukeables);
    log.toast('SUCCESS', 'Nuked (', nukeables.length, ') systems');
  } else {
    log.info('Found 0 systems that could be nuked');
  }
}

async function scrubNetwork(process: NPProcess) {
  const {ns, log} = process;
  const network = await getNPNetwork(ns); // TODO: RAM
  let deployed = getDeployed(network);
  scrub(process, deployed, CNPVirusfiles);
  const servers = await getNPServers(ns, false); // TODO: RAM
  deployed = getDeployed(servers);
  scrub(process, deployed, CNPVirusfiles);
}

async function deployNetwork(process: NPProcess) {
  const {ns, log} = process;
  const network = await getNPNetwork(ns); // TODO: RAM
  let deployables = getDeployable(network);
  await deploy(process, deployables, CNPVirusfiles);
  const servers = await getNPServers(ns); // TODO: RAM
  deployables = getDeployable(servers);
  await deploy(process, deployables, CNPVirusfiles);
}

export async function main(ns: NS) {
  const process = new NPProcess(
    ns, 'NukeAndDeploy',
    [{name: '_', comment: 'Action: ' + CNPNetworkActions.join('|'), matches: CNPNetworkActions}],
    {feedbackPort: CNPServicePortGame}
  );

  await process.run(async () => {
    const action = process.args.getWithFallback<ENPNetworkActions>('_', ENPNetworkActions.nukeNetwork);
    switch (action) {
      case ENPNetworkActions.scrubNetwork:
        await scrubNetwork(process);
        break;
      case ENPNetworkActions.deployNetwork:
        await deployNetwork(process);
        break;
      default:
      case ENPNetworkActions.nukeNetwork:
        await nukeNetwork(process);
        await deployNetwork(process);
        break;
    }
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  const current = args.filter(value => CNPReservedArguments.indexOf(value) < 0);
  if (current.length === 1) {
    return CNPNetworkActions;
  }
}
