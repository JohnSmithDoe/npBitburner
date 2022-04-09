//<editor-fold desc="*** np Scripts (all files) ***">

// copy to build script on changes
// noinspection JSUnusedGlobalSymbols
export enum ENPScripts {
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

export const CNPVirusfiles = [ENPScripts.Virus, ENPScripts.Consts, ENPScripts.Bitburner]; // they get deployed to each system

//</editor-fold>

//<editor-fold desc="*** .EXE Files that can be created or bought ***">

//</editor-fold>

// Chongqing New Tokyo Ishima gehen gut zusammen
// Aevum und Sector 12 gehen zusammen
// volhaven steht alleine da

export const CNPHackThreshMoneyMaintain = 0.85; // MaxMoney *
export const CNPHackThreshMoneyBuildUp = 1; // MaxMoney *
export const CNPHackThreshMoneyDrain = 0; // MaxMoney *

export const CNPHackThreshSecurity = 15; // MinSecurityLevel + (1-100)
export const CNPHackThreshChance = .75; // start hacking at a chance of 75%
export const CNPHomeRamSaveAmount = 512; // Do not aquire this amount of GB on home system (Rest is used for virus)



export const CNPFileExtContract = '.cct';


export type TNPFilesMonitorSettings = 'npScripts' | 'npBooks' | 'npContracts';

export const CNPMonitors = {
  'npPlayer':     {
    monitor: ENPScripts.PlayerMonitor,
    options: []
  },
  'npSystem':     {
    monitor: ENPScripts.SystemMonitor,
    options: []
  },
  'npFaction':    {
    monitor: ENPScripts.FactionsMonitor,
    options: []
  },
  'npContracts':  {
    monitor: ENPScripts.ContractsMonitor,
    options: []
  },
  'npHacknet':    {
    monitor: ENPScripts.HacknetMonitor,
    options: []
  },
  'npHacking':    {
    monitor: ENPScripts.HackingMonitor,
    options: []
  },
  'npNetwork':    {
    monitor: ENPScripts.NetworkMonitor,
    options: []
  },
  'npServerfarm': {
    monitor: ENPScripts.ServerMonitor,
    options: []
  },
  'npFiles':      {
    monitor:  ENPScripts.FilesMonitor,
    options:  ['npScripts', 'npBooks', 'npContracts'],
    fallback: 'npScripts'
  }
};
export type TNPMonitorType = keyof typeof CNPMonitors;


export type TNPServerfarmStrategy = 'npAffordable' | 'npExponential' | 'npMaxOut' | 'npLinear';

export const CNPStrategies = {
  'npManageServerfarm': {
    action:  ENPScripts.ManageServerfarm,
    options: ['npAffordable', 'npExponential', 'npMaxOut', 'npLinear'],
  },
};

export const CNPPathSeperator = '|';

export enum ENPHackingActions {
  attack = 'npAttackNetwork',
}

export const CNPHackingActions = Object.values(ENPHackingActions);

export enum ENPNetworkActions {
  scrubNetwork  = 'npScrubNetwork',
  nukeNetwork   = 'npNukeNetwork',
  deployNetwork = 'npDeployNetwork',
}

export const CNPNetworkActions = Object.values(ENPNetworkActions);


export enum ENPVirusModes {
  generateXP   = 'npGenerateXP',
  attackSystem = 'npAttack',
  drainSystem = 'npDrain'
}

export type TNPVirusProcess = { target: string, threads: number, mode: ENPVirusModes, pid?: number }

export const CNPNullPortData = 'NULL PORT DATA';
// TODO: logging
export const CNPServicePortGame = 1;
export const CNPServicePortPlayer = 2;
