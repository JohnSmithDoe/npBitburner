import {ENPCities, ENPFactions, ENPMegaCorps, ENPSystems} from 'scripts/utils/npBitburner';
import {ENPScripts} from 'scripts/utils/npConsts';
import {AugmentationStats} from './NetscriptDefinitions';

export interface INPBaseContract {
  host: string;
  filename: string;
  type: string;
  data: any;
}

export interface INPContract extends INPBaseContract{
  desc: string;
  tries: number;
}

export interface INPSystem {
  host: string,
  path: string,
  requiredPorts: number,
  requiredHackingLevel: number,
  maxMoney: number,
  maxRam: number,
  minSecurityLevel: number,
  threads: number,
  state: {
    rootAccess: boolean,
    nukeable: boolean,
    hackable: boolean,
    backdoor: boolean,
    virusRunning: boolean,
    deployed: boolean,
    hackChance: number,
    hackRating: number,
    money: number,
    securityLevel: number,
    freeRam: number,
    usedRam: number,
  }
}

export type TNPScanFn = (host: string, path: string[]) => Promise<void>;

export interface INPPlayer {
  name: 'Letothec0dem0nkey'; // :)
  hackingLevel: number;
  hackingPorts: number;
  money: number;
  tor: boolean;
  city: ENPCities,
  karma: number;
  installedAugs: number;
  augmentations: string[];
  files: string[];
}

export type TNPLogLevel = 'DEBUG' | 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR' | 'FAIL';


export type TNPAction = () => Promise<void | boolean>;
export type TNPActionParam = { name: string, required?: boolean, comment: string, matches?:string[]};
export type TNPProcessOptions = { timer?: number; feedbackPort?: number; keepLog?: boolean, logChars?: number};


interface INPAugmentation {
  name: string,
  faction: string,
  price: number,
  stats: AugmentationStats,
  reputation: number,
  prereq: string[]
}

export interface INPFaction {
  faction: string;
  augs: INPAugmentation[];
  reputation: number,
}

export type TNPServerfarmServer = { host: string, threads: number, ram: number, free: number, used: number };


export type TNPTask = { script: ENPScripts, args: string[] };
