import {NPArguments} from 'scripts/model/npArguments';
import {NetscriptPort, NS} from '../../@types/NetscriptDefinitions';
import {TNPActionParam, TNPLogLevel} from '../../@types/npTypes';

export class NPLogger {
  public logToTerminal = false;
  public npLogLvl: TNPLogLevel = 'INFO'; // TODO enum?

  private loggingChars = 50;
  private feedbackPort?: number;
  private feedbackChannel?: NetscriptPort;

  constructor(private ns: NS, args: NPArguments, params: TNPActionParam[]) {
    this.logToTerminal = args.hasArgument('terminal'); // TODO enum saved arguments
    if (!args.hasArgument('syslog')) ns.disableLog('ALL');
    if (args.hasArgument('tail')) ns.tail();
    if (args.hasArgument('debug')) this.npLogLvl = 'DEBUG';
    params.push({name: 'tail', comment: 'Auto Tail'});
    params.push({name: 'syslog', comment: 'Enable Syslog Messages'});
    params.push({name: 'debug', comment: 'Set Logging Level to Debug'});
    params.push({name: 'terminal', comment: 'Set Logging to Terminal'});
    ns.clearLog();
  }

  log(lvl: TNPLogLevel, ...args) {
    let prefix: string = lvl + ' - ';
    if (lvl === 'INFO') {
      prefix = '';
    }
    if (lvl === 'DEBUG') {
      if (this.npLogLvl !== 'DEBUG') return;
      prefix = 'INFO - '; // Debug -> INFO, Info -> Nothing
    }
    const msg = prefix + args.join('');
    this.logToTerminal ? this.ns.tprint(msg) : this.ns.print(msg);
    if(this.feedbackChannel){
      this.feedbackChannel.write(msg);
    }
  };

  line(lvl: TNPLogLevel = 'INFO') {this.log(lvl, ''.padEnd(this.loggingChars - (lvl !== 'INFO' ? lvl.length + 3 : 0), '*'));}

  wrap(msg: string, lvl: TNPLogLevel = 'INFO') {
    const pad = this.loggingChars - 4 - (lvl !== 'INFO' ? lvl.length + 3 : 0);
    if (pad > 0) {
      this.log(lvl, '* ' + msg.padEnd(pad, ' ') + ' *');
    } else {
      this.log(lvl, '* ' + msg);
    }
  }

  value(name: string, value: string, lvl: TNPLogLevel = 'INFO') {
    const first = '* ' + name + ': ';
    const second = value + ' *';
    const pad = this.loggingChars - first.length - second.length - (lvl !== 'INFO' ? lvl.length + 3 : 0);
    if (pad > 0) {
      this.log(lvl, first.padEnd(pad + first.length, ' ') + second);
    } else {
      this.log(lvl, first + second);
    }
  }

  headline(title: string, lines = true, lvl: TNPLogLevel = 'INFO') {
    const starsCount = Math.trunc((this.loggingChars - (lvl !== 'INFO' ? lvl.length + 3 : 0) - title.length - 2) / 2);
    const stars = new Array(starsCount).fill('*').join('');
    if (lines) this.line(lvl);
    this.log(lvl, stars, ' ', title, ' ', stars, (title.length % 2 === 1) ? '*' : '');
    if (lines) this.line(lvl);
  }

  debug(...args) {this.log('DEBUG', ...args);}
  debugAssert(success: boolean, ...args) {
    this.log(success ? 'DEBUG' : 'FAIL', ...args, success ? ' -> succeeded' : ' -> failed');
  }

  info(...args) {this.log('INFO', ...args);}

  success(...args) {this.log('SUCCESS', ...args);}

  warn(...args) {this.log('WARN', ...args);}

  fail(...args) {this.log('FAIL', ...args);}

  error(...args) {this.log('ERROR', ...args);}

  assert(success: boolean, ...args) {
    this.log(success ? 'SUCCESS' : 'FAIL', ...args, success ? ' -> succeeded' : ' -> failed');
  }

  // "success", "info", "warning", or "error"
  toast(lvl: TNPLogLevel, ...args) {
    this.log(lvl, ...args);
    if ((lvl === 'DEBUG') || (lvl === 'FAIL')) {
      lvl = 'ERROR';
    }
    const toastLvl = (lvl === 'WARN') ? 'warning' : lvl.toLowerCase();
    this.ns.toast(args.join(''), toastLvl);
  }

  toastAssert(success: boolean, ...args) {
    this.toast(success ? 'SUCCESS' : 'FAIL', ...args, success ? ' -> succeeded' : ' -> failed');
  }

  setLoggingChars(chars: number) {
    this.loggingChars = chars;
  }

  resetLoggingChars() {
    this.loggingChars = 50;
  }

  setFeedbackPort(feedbackPort: number) {
    this.feedbackPort = feedbackPort;
    this.feedbackChannel = this.ns.getPortHandle(feedbackPort);
  }
}

