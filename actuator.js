//import  BatchRecorder, ConsoleRecorder, Logger, model from 'zipkin';
//import fetch from 'node-fetch';

'use strict';
var http = require('http');
var express = require('express');    
var app = express();
var opentracing = require('opentracing');
var error = new Error("The error message");
//const Prometheus = require('prom-client');
app.get('/actuator', function (req, res) {  	
//res.begin(Prometheus.register.metrics());
res.charset = 'utf8';
res.set({
  'content-type': 'application/json'
}).send('{"status": "0"}');	  
//res.end(Prometheus.register.metrics());//
//const {
  Tracer,
  BatchRecorder,
  jsonEncoder: {JSON_V2}
} = require('zipkin');//
//const {HttpLogger} = require('zipkin-transport-http');//
//const noop = require('noop-logger');

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: 'http://localhost:9411/api/v2/spans', // Required
    jsonEncoder: JSON_V2, // JSON encoder to use. Optional (defaults to JSON_V1)
    httpInterval: 1000, // How often to sync spans. Optional (defaults to 1000)
    headers: {'Authorization': ''}, // Custom HTTP headers. Optional
    timeout: 1000, // Timeout for HTTP Post. Optional (defaults to 0)
    maxPayloadSize: 0, // Max payload size for zipkin span. Optional (defaults to 0)
    agent: new http.Agent({keepAlive: true}), // Agent used for network related options. Optional (defaults to null)
    log: console, // Logger to use. Optional (defaults to console)
    fetchImplementation: require('node-fetch') // Pluggable fetch implementation (defaults to global fetch or fallsback to node fetch)
  })
});


/*function ExplicitContext(title, content) {
                //var title = new EventTarget();
	        this.title = title;
                this.content = content;
                this.collapsed = true;
	        //this.addEventListener("click",RespondClick);
	        //title.addEventListener("click", this.titleClickListener, true);
            };
var ctxImpl = new ExplicitContext();
var tiracer = new Tracer({
  recorder,
  ctxImpl, // this would typically be a CLSContext or ExplicitContext
  localServiceName: 'actuator' // name of this application
});


var fetch = require('node-fetch');
const wrapFetch = require('zipkin-instrumentation-fetch');
const remoteServiceName = 'actuator';
const zipkinFetch = wrapFetch(fetch, {tracer, remoteServiceName});
zipkinFetch('http://localhost:8082/actuator').then(res => res.json()).then(data => data);*/
var express = require('express');
var app = express();
var initTracer = require('jaeger-client').initTracer;
var config = {
serviceName: 'actuator',
 'local_agent': {
                'reporting_host': 'jaeger',
                'reporting_port': '6831',
            },
reporter: {   logSpans: true,  },
sampler: {    type: 'const',    param: 1  }};
var options = {  tags: { 'actuator.version': '0.0.0',  } ,logger: console};
var tracer = initTracer(config, options);
const span = tracer.startSpan("http_request");
span.addTags({
    [opentracing.Tags.SPAN_KIND]: opentracing.Tags.SPAN_KIND_MESSAGING_PRODUCER,
    [opentracing.Tags.HTTP_METHOD]: req.method,
    [opentracing.Tags.HTTP_URL]: req.path
  }); 
span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
span.setTag(opentracing.Tags.ERROR, true).log({ error: error });
span.finish();
span.setTag(opentracing.Tags.HTTP_STATUS_CODE, res.statusCode);
opentracing.initGlobalTracer(tracer);
});
var server = app.listen(8082, function () {
var host = server.address().address;
var port = server.address().port;
console.log("Example app listening at http://%s:%s", host, port);
});
