import {NPProcess} from 'scripts/model/npProcess';
import {CNPNullPortData, ENPScripts} from 'scripts/utils/npConsts';
import {canRunScript, getMaxThreadCount, getProcesses, getScriptRamCost, isRunning, killScript, startScript} from 'scripts/utils/npNetscript';
import {NetscriptPort, NS, ProcessInfo} from '../../@types/NetscriptDefinitions';
import {TNPActionParam, TNPTask} from '../../@types/npTypes';

export class NPController extends NPProcess {

  private getMonitorProcesses(host = 'home'): ProcessInfo[] {
    return getProcesses(this.ns).filter(process => process.filename.indexOf('Monitor') >= 0);
  }

  private canRunWithoutMonitors(script: ENPScripts, host = 'home') {
    const monitors = this.getMonitorProcesses(host);
    let result = false;
    let saveable = 0;
    for (const process of monitors) {
      saveable += getScriptRamCost(this.ns, process.filename, host);
      result = canRunScript(this.ns, script, host, -saveable);
      if (result) break;
    }
    return result;
  }

  private killMonitorsForScript(script: ENPScripts, host = 'home') {
    const monitors = this.getMonitorProcesses(host);
    let result = false;
    for (const process of monitors) {
      killScript(this.ns, process.filename, host);
      result = canRunScript(this.ns, script, host);
      if (result) break;
    }
    return result;
  }

  // kills monitors if ram is needed
  private startScript(script: ENPScripts, args: string[], host) {
    if (canRunScript(this.ns, script, host)) {
      startScript(this.ns, script, args, 1, host);
    } else {
      if (this.canRunWithoutMonitors(script, host)) {
        this.killMonitorsForScript(script, host);
        startScript(this.ns, script, args, 1, host);
      } else {
        this.log.warn('Not enough RAM to start: ', script);
      }
    }

  }

  // run multiple versions as cron
  startMonitor(script: ENPScripts, args: string[] = [], host = 'home') {
    const {ns, log} = this;
    args = ['tail', 'cron', 'ctime=2000', ...args];
    const running = isRunning(this.ns, script, host, args);
    log.debug('Monitor is ' + (running ? 'already' : 'not '), ' running: ', script, ...args);
    if (running) {
      log.debug('Bring back to front');
      ns.tail(script, host, ...args);
    } else {
      this.startScript(script, args, host);
    }
  }

  // run only one instance of the script
  startProcess(script: ENPScripts, args: string[], host = 'home') {
    const {ns, log} = this;
    if (isRunning(ns, script, host)) return true;
    log.info('Controller not running -> ...starting: ', host, script);
    this.startScript(script, args, host);
  }

  // run only one instance as cron
  startService(script: ENPScripts, args: string[] = [], host = 'home') {
    const {ns, log} = this;
    // service should only run in one instance
    if (isRunning(ns, script, host)) return true;
    log.info('Service not running -> ...starting as cron: ', host, script);
    this.startScript(script, ['tail', 'cron', 'ctime=2000', ...args],  host);
  }

  stopService(script: ENPScripts,  host = 'home') {
    killScript(this.ns, script, host);
  }

  restartService(script: ENPScripts, args: string[] = [], host = 'home') {
    this.stopService(script, host);
    this.startService(script, args, host);
  }


}


export class NPService extends NPController {
  public queue: TNPTask[] = [];

  public feedbackChannel?: NetscriptPort;

  constructor(ns: NS, name: string, params: TNPActionParam[], public feedbackPort?: number) {
    super(ns, name, params, {keepLog: true});
    this.options.keepLog = true;
    if(feedbackPort){
      this.feedbackChannel = this.ns.getPortHandle(feedbackPort);
    }
  }

  public handleTask(host = 'home') {
    const task = this.queue.shift();
    return !task ? false : this.startProcess(task.script, task.args, host);
  }

  public queueIn(script: ENPScripts, args: string[]) {
    this.queue.push({script, args});
  }

  hasTasks() {
    return !!this.queue.length;
  }

  reportFeedback() {
    const portHandle = this.feedbackChannel;
    if(!portHandle) return;
    while(portHandle.peek() !== CNPNullPortData){
      this.log.info('Feedback: ' + portHandle.read());
    }
  }
}
