import {NPArguments} from 'scripts/model/npArguments';
import {NPLogger} from 'scripts/model/npLogging';
import {printFnUsage} from 'scripts/utils/npCheapUtils';
import {NS} from '../../@types/NetscriptDefinitions';
import {TNPAction, TNPActionParam, TNPProcessOptions} from '../../@types/npTypes';

export class NPProcess {
  log: NPLogger;
  args: NPArguments;

  constructor(public ns: NS,
              public name: string,
              public params: TNPActionParam[],
              public options: TNPProcessOptions
  ) {
    this.args = new NPArguments(ns);
    this.log = new NPLogger(ns, this.args, params);
    if (this.options.timer || this.args.hasArgument('cron')) {
      this.options.timer = this.options.timer || 2000;
      this.params.push({name: 'cron', comment: 'Run as cron job'});
      this.params.push({name: 'ctime', comment: 'Cron job repeat cycle (5000)'});
      if (this.args.hasArgument('ctime')) {
        this.options.timer = this.args.asNumber('ctime');
      }
    }
    if(this.options.feedbackPort){
      this.log.setFeedbackPort(this.options.feedbackPort);
    }
  }

  private async runAsCron(cronjob: TNPAction) {
    let iteration = 0;
    let keepRunning = true;
    do {
      if (!this.options.keepLog) this.ns.clearLog();
      this.log.debug('Running as Cron-Job: (' + ++iteration + ')');
      const jobResult = await cronjob();
      keepRunning = (typeof jobResult === 'undefined') ? true : jobResult;
      if (!keepRunning) {
        this.log.toast('INFO', 'Ending Cron-Job: (', iteration, ') - ', this.ns.getScriptName());
      } else {
        this.log.debug('Finished Cron-Job (', iteration, ') going to sleep: ', this.options.timer);
        await this.ns.sleep(this.options.timer || 2000);
      }
    } while (keepRunning);
  }

  async run(action: TNPAction) {
    if(!this.args.isValid(this.params)){
      printFnUsage(this, 'ERROR', this.name);
    }else if (this.args.hasArgument('help')) {
      printFnUsage(this, 'INFO', this.name);
    } else {
      if (this.options.timer) {
        await this.runAsCron(action);
      } else {
        await action();
      }
    }
  }
}

