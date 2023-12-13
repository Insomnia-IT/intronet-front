import log4js from "log4js";
import * as process from "process";

if (process.env.LOGSTASH) {
  log4js.configure({
    appenders: {
      logstash: {
        "type": "log4js-logstash-tcp",
        "host": process.env.LOGSTASH,
        "port": 5000,
        "fields": {
          "environment": "development"
        }
      }
    },
    categories: {
      default: { appenders: ['logstash'], level: 'info' }
    }
  });
}

export const logCtrl = new class {
  logger = process.env.LOGSTASH ? log4js.getLogger() : null;
  log = (data: any) => {
    if (!process.env.LOGSTASH)
      return;
    this.logger.log('INFO', {
      '@tags': ['nodejs', 'test'],
      '@timestamp': new Date().getTime(),
      '@version': '1',
      ...data,
    })
  }
}
