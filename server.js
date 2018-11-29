const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request');

const requestController = require('./controller/requestController.js');

const PORT = process.env.PORT || 3100
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
   res.send("Hello World!");
});

router.post('/bot', function(req, res) {
  // console.log(req.body.originalDetectIntentRequest.payload.data);
  const action = req.body.queryResult.action;

  console.log(req.body);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(req.body.originalDetectIntentRequest.payload.data);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
/*  console.log(req.body.queryResult.fulfillmentMessages);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");*/
  let param = {
    'user': req.body.originalDetectIntentRequest.payload.data.user,
    'token': 'xoxp-480772759907-481075144165-488563309525-c99d9da4f3e6501b79335f387cb30ff',
    'module': (action.indexOf('/') >-1) ? action.split('/')[0] : action,
    'action': (action.indexOf('/') >-1) ? action.split('/')[1] : action,
    'inputText': req.body.queryResult.fulfillmentText || req.body.queryResult.queryText,
    'keyResponse': 'fulfillmentText',
    'parameters': req.body.queryResult.parameters
  };
  require('./service/'+ param.module +'Service').controller(param, res);
  // requestController.callAPI(param, res);
});

router.post('/slacky', function(req, res) {
    console.log(req.body);
    res.send({
    "challenge": req.body.challenge
});
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
