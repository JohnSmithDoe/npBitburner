import {NPProcess} from 'scripts/model/npProcess';
import {CNPServicePortPlayer} from 'scripts/utils/npConsts';
import {getNPNetwork} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {INPContract} from '../../@types/npTypes';

export function printNPContracts(process: NPProcess, contracts: INPContract[], filter: string) {
  const {log} = process;
  log.headline('Coding Contracts');
  log.value('Filter', filter);
  for (const contract of contracts) {
    log.value('File', contract.host + '::' + contract.filename);
    log.debug('Description: ', contract.desc);
    log.value('Type', contract.type);
    log.value('Remaining tries','' +contract.tries);
    log.debug('Data: ', contract.data);
    log.line();
  }
}

export async function getContracts(ns: NS, grep?: string) {
  const contracts: INPContract[] = [];
  const network = await getNPNetwork(ns);

  for (const system of network) {
    let systemContracts = ns.ls(system.host, '.cct');
    if (grep) {
      systemContracts = systemContracts.filter(file => (file.indexOf(grep) >= 0) || (system.host === grep));
    }
    for (const contract of systemContracts) {
      contracts.push(
        {
          host:     system.host,
          filename: contract,
          desc:     ns.codingcontract.getDescription(contract, system.host), // very expensive 5GB
          type:     ns.codingcontract.getContractType(contract, system.host),//  very expensive 5GB
          data:     ns.codingcontract.getData(contract, system.host),// very expensive 5GB
          tries:    ns.codingcontract.getNumTriesRemaining(contract, system.host),// very expensive 2GB
        });
    }
  }
  return contracts;
}

export async function main(ns: NS) {
  const monitor = new NPProcess(
    ns,
    'Contracts-Monitor',
    [{name: '_', comment: 'Grep by contract name or host'}],
    {}
  );
  const grep = monitor.args.getOptional('_');
  await monitor.run(async () => {
    const contracts = await getContracts(ns, grep);
    printNPContracts(monitor, contracts, grep || 'all');
  });
}

// noinspection JSUnusedGlobalSymbols
export function autocomplete(data, args) {
  return data.servers;
}
