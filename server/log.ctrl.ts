import log4js from "log4js";

log4js.configure({
  appenders: {
    logstash: {
      "type": "log4js-logstash-tcp",
      "host": "logstash",
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

export const logCtrl = new class {
  logger = log4js.getLogger();
  log(data: any){
    this.logger.log('INFO', {
      '@tags': ['nodejs', 'test'],
      '@timestamp': new Date().getTime(),
      '@version': '1',
      ...data,
    })
  }
}
