const ChaosMonkey = require('chaos-monkey');
//pass in a reference to express app so the monkey can generate damage also within Express routes. This param is optional //but without it some pranks won't be available
ChaosMonkey.initialize('actuator.js');
module.exports = {
  sideMonkeyPort: 8082,
  startMode: "passive", //config, passive (for API calls)
  pranks: [{
      name: "500-error-on-route",
      file: "500-error-on-route",
      active: true,
      properties: {
        urls: ["/api/products", "/anyurl"]

      },
      schedule: {
        type: "immediate-schedule",
        fadeOutInMS: 10000
      }
    },
    {
      name: "process-exit",
      file: "process-exit",
      active: true,
      properties: {
        exitCode: 1
      },
      schedule: {
        type: "one-time-schedule",
        delay: 60000
      }
    },
    {
      name: "uncaught-exception",
      file: "uncaught-exception",
      active: false,
      properties: {
        message: "Uncaught exception was thrown by the chaos monkey"
      },
      schedule: {
        type: "one-time-schedule",
        delay: 9000
      }
    },
    {
      name: "memory-load",
      file: "memory-load",
      active: true,
      properties: {
        maxMemorySizeInMB: 10
      },
      schedule: {
        type: "one-time-schedule",
        delay: 1000,
        fadeOutInMS: 30000
      }
    },
    {
      name: "cpu-load",
      file: "cpu-load",
      active: false,
      properties: {},
      schedule: {
        type: "peaks",
        sleepTimeBetweenPeaksInMS: 3000,
        pickLengthInMS: 10000,
        forHowLong: 8000
      }
    }
  ]
};
const config = {
  serviceName: 'name-of-the-service',
  reporter: {
    collectorEndpoint: 'http://jaegercollector:14268/api/traces',
    logSpans: true,
  },
  sampler: {
    type: 'const',
    param: 1
  }
};
const options = {
  tags: {
    'name-of-the-service.version': '0.0.0',
  },
  logger: console,
};
const tracer = initTracer(config, options);
module.exports = require('./chaos-control');