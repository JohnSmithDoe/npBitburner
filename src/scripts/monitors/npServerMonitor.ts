import {NPLogger} from 'scripts/model/npLogging';
import {NPProcess} from 'scripts/model/npProcess';
import {getNPServers, hrRam, system2server} from 'scripts/utils/npUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {TNPServerfarmServer} from '../../@types/npTypes';

function getServerStats(ns: NS, servers: TNPServerfarmServer[], top = 3) {
  const topSystems: TNPServerfarmServer[] = [];
  const stats = {
    systems: 0,
    ram:     0,
    used:    0,
    free:    0,
    threads: 0,
    topSystems
  };
  [...servers]
    .sort((a, b) => b.ram - a.ram)
    .forEach(server => {
      stats.systems++;
      stats.ram += server.ram;
      stats.used += server.used;
      stats.free += server.free;
      stats.threads += server.threads;
      if (top-- > 0) stats.topSystems.push(server);
    });
  return stats;
}

function printServer(log: NPLogger, idx: number, server: TNPServerfarmServer) {
  log.value(` #${idx + 1} ${server.host}`, `${hrRam(server.ram)}(t=${server.threads})`,);
}

function printServerfarmStats(process: NPProcess, systems: TNPServerfarmServer[]) {
  const {ns, log} = process;
  const stats = getServerStats(ns, systems);

  log.headline('Serverfarm');
  log.value('Servers/Ram/Threads', `${stats.systems}/${hrRam(stats.ram)}/${stats.threads}`);
  log.line();
  log.headline('Top-Three-Servers', false);
  stats.topSystems.forEach((item, index) => printServer(log, index, item));
  log.line();
  systems.forEach((system, idx) => printServer(log, idx, system));
  log.line();
}


export async function main(ns: NS) {
  const monitor = new NPProcess(ns, 'Network-Monitor', [
    {name: '_', comment: 'Host'},
    {name: 'Page', comment: 'Show Page No'}
  ],
                                {});
  await monitor.run(async () => {
    const network = await getNPServers(ns, false);
    const servers = network
      .map(system => system2server(ns, system))
      .sort((a, b) => a.host.localeCompare(b.host));
    //.filter((item, index) => isPageOne ? index <= 35 : index > 35);
    printServerfarmStats(monitor, servers);

  });
}
