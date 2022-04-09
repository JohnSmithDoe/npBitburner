// noinspection JSUnusedGlobalSymbols,SpellCheckingInspection

import {NS} from '../@types/NetscriptDefinitions';

// copied from npConsts (remove export)
enum ENPScripts {
  Connect                 = '/scripts/actions/bash/connect.js',
  Htop                    = '/scripts/actions/bash/htop.js',

  InstallBackdoor         = '/scripts/actions/singularity/installBackdoor.js',
  ManageFactions          = '/scripts/actions/singularity/manageFactions.js',
  ManageNetwork           = '/scripts/actions/singularity/manageNetwork.js',
  ManagePlayer            = '/scripts/actions/singularity/managePlayer.js',
  ManagePossessions       = '/scripts/actions/singularity/managePossessions.js',
  ManageAugmentations     = '/scripts/actions/singularity/manageAugmentations.js',

  ManageHacking           = '/scripts/actions/manageHacking.js',
  ManageHacknet           = '/scripts/actions/manageHacknet.js',
  ManageServerfarm        = '/scripts/actions/manageServerfarm.js',
  NukeAndDeploy           = '/scripts/actions/nukeAndDeploy.js',
  SolveContracts          = '/scripts/actions/solveContracts.js',

  MonitorController       = '/scripts/controller/npMonitorController.js',
  ServiceController       = '/scripts/controller/npServiceController.js',

  TemperWithGame          = '/scripts/hacking/npTemperWithGame.js',
  Virus                   = '/scripts/hacking/npVirus.js',

  ArgumentsModel          = '/scripts/model/npArguments.js',
  ControllerModel         = '/scripts/model/npController.js',
  LoggerModel             = '/scripts/model/npLogging.js',
  ProcessModel            = '/scripts/model/npProcess.js',

  ContractsMonitor        = '/scripts/monitors/npContractsMonitor.js',
  FactionsMonitor         = '/scripts/monitors/npFactionsMonitor.js',
  FilesMonitor            = '/scripts/monitors/npFilesMonitor.js',
  HackingMonitor          = '/scripts/monitors/npHackingMonitor.js',
  HacknetMonitor          = '/scripts/monitors/npHacknetMonitor.js',
  NetworkMonitor          = '/scripts/monitors/npNetworkMonitor.js',
  PlayerMonitor           = '/scripts/monitors/npPlayerMonitor.js',
  ServerMonitor           = '/scripts/monitors/npServerMonitor.js',
  SystemMonitor           = '/scripts/monitors/npSystemMonitor.js',

  GameService             = '/scripts/services/npGameService.js',
  PlayerService           = '/scripts/services/npPlayerService.js',

  Bitburner               = '/scripts/utils/npBitburner.js',
  Cheap                   = '/scripts/utils/npCheapUtils.js',
  Consts                  = '/scripts/utils/npConsts.js',
  Formulars               = '/scripts/utils/npFormulars.js',
  Netscript               = '/scripts/utils/npNetscript.js',
  Singularity             = '/scripts/utils/npSingularity.js',
  Strategy                = '/scripts/utils/npStrategy.js',
  Utils                   = '/scripts/utils/npUtils.js',
}


function clean(ns: NS) {
  ns.ls('home', '.js').forEach(file => {
    if (file !== 'build.js' && file !== 'test.js') {
      ns.tprint('removing: ', file);
      ns.rm(file);
    }
  });
}

function move(ns: NS, files: string[]) {
  const stats = {total: files.length, moved: 0, notFound: 0};
  for (let filename of files) {
    const rootfile = '' + filename.split('/').pop();
    if (ns.fileExists(rootfile)) {
      ns.tprint('Moving ', rootfile, ' to: ', filename);
      ns.mv('home', rootfile, filename);
      stats.moved++;
    } else {
      stats.notFound++;
    }
  }
  return stats;
}

export async function main(ns: NS) {
  const data = ns.flags([['mode', 'move']]);
  const mode = data.mode;
  if (['move', 'clean', 'list'].indexOf(mode) < 0) {
    ns.tprint('WARNING: USAGE:: build.js mode=move|clean|list');
  }
  const CNPAllProjectFiles = Object.values(ENPScripts);
  if (mode === 'move') {
    ns.tprint('Moving files to folders');
    const stats = {total: 0, moved: 0, notFound: 0};
    const lStats = move(ns, CNPAllProjectFiles);
    stats.total += lStats.total;
    stats.moved += lStats.moved;
    stats.notFound += lStats.notFound;
    ns.tprint('Moved: ', stats.moved, '/', stats.total, ' Not Found: ', stats.notFound, '/', stats.total);
  } else if (mode === 'clean') {
    ns.tprint('Cleaning files from folders');
    clean(ns);
  } else if (mode === 'list') {
    CNPAllProjectFiles.forEach(filename => {
      ns.tprint(ns.fileExists(filename) ? filename : 'WARN ' + filename + ' not found');
    });
  }
}
