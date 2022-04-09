import {NS} from '../../@types/NetscriptDefinitions';
import {TNPActionParam} from '../../@types/npTypes';

export const CNPReservedArguments = ['terminal', 'cron', 'ctime', 'tail', 'help', 'debug'];

type Ttest = string | undefined;

//<editor-fold desc="*** Own Argument handling... *** ">
// maybe switch to ns.flags
export class NPArguments {
  parsed: { [key: string]: string };
  static UNNAMED = '_';

  static parseArguments(ns: NS) {
    const parsed: { [key: string]: string } = {};
    for (const arg of ns.args) {
      let name = NPArguments.UNNAMED;
      let value: string | number | boolean = '';
      switch (typeof arg) {
        case 'boolean':
          value = arg ? 'true' : 'false';
          break;
        case 'number':
          value = arg.toString();
          break;
        case 'string':
          const valuePair = arg.indexOf('=');
          if (valuePair > 0) {
            name = arg.substring(0, valuePair);
            value = arg.substring(valuePair + 1);
          } else {
            if (CNPReservedArguments.indexOf(arg) >= 0) {
              name = arg;
              value = 'true';
            } else {
              value = arg;
              parsed[arg] = 'true'; // also add name=true
            }
          }
          break;
      }
      while (parsed[name] !== undefined) name += NPArguments.UNNAMED;
      parsed[name] = value;
    }
    return parsed;
  }

  constructor(ns: NS) {
    this.parsed = NPArguments.parseArguments(ns);
  }

  getRequired<T extends string>(name: string = NPArguments.UNNAMED): T {
    const value = this.getOptional(name);
    if (typeof value !== 'string') throw new Error('Required Parameter missing: ' + name);
    return value as T;
  }

  getWithFallback<T>(name: string = NPArguments.UNNAMED, fallback: T, matches?: string[]): T {
    const value = this.getOptional(name, matches);
    return value as unknown as T || fallback;
  }

  getOptional(name: string = NPArguments.UNNAMED, matches?: string[]) {
    const argument = this.parsed[name];
    if (matches && !!argument) {
      return matches.indexOf(argument) >= 0 ? argument : undefined;
    }
    return this.parsed[name];
  }


// Returns the first unnamed argument or the fallback if there is none

  hasArgument(name: string = NPArguments.UNNAMED, matches?: string[]): boolean {
    const argument = this.getOptional(name);
    if (matches && typeof argument === 'string' && !!argument) {
      return matches.indexOf(argument) >= 0;
    }
    return !!argument;
  }

  asBool(name: string): boolean {
    return this.getOptional(name) !== 'false';
  }

  asNumber(name: string, fallback: number = Infinity): number {
    const value = this.getOptional(name);
    if (!value) return fallback;
    return Number.parseInt(value);
  }

  isValid(params: TNPActionParam[]) {
    let isValid = true;
    for (let param of params) {
      if (param.required) {
        const argument = this.getOptional(param.name, param.matches);
        isValid = isValid && !!argument;
      }
    }
    return isValid;
  }
  toString(){
    return Object.keys(this.parsed).map(key => key + '='+this.parsed[key]).join('|');
  }
}
