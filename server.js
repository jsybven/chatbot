const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request'),
      { slackConfig, slackProcessRequest } = require('./enviroment/slack.js'),
      requestController = require('./controller/requestController.js');
require('dotenv').config();

const PORT = process.env.PORT;
let router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

router.get('/', function(req, res) {
   res.send("hablame el mio!");
});

router.post('/bot', function(req, res) {
  // console.log(req.body.originalDetectIntentRequest.payload.data);
  const action = req.body.queryResult.action;

/*  console.log(req.body);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(req.body.originalDetectIntentRequest);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(req.body.queryResult.fulfillmentMessages);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");*/
  let param = {
    'user': 'el jean', // req.body.originalDetectIntentRequest.payload.data.user,
  //  slackConfig[0].tokenAPI,
    'module': (action.indexOf('/') >-1) ? action.split('/')[0] : action,
    'action': (action.indexOf('/') >-1) ? action.split('/')[1] : action,
    'inputText': req.body.queryResult.fulfillmentText || "ocurrior un error",
    'keyResponse': 'fulfillmentText',
    'parameters': req.body.queryResult.parameters,
    'outputContexts': req.body.queryResult.outputContexts,
    'todo': req.body
  };
  require('./service/'+ param.module +'Service').controller(param, res);
  // requestController.callAPI(param, res);
});

router.post('/middleware', function(req, res) {
  const provider = identifyProvider(req);
  if (provider.name === 'slack') {
    slackProcessRequest(req, provider);
  }
  res.end();
/*  res.send({
    "challenge": req.body.challenge
  }); */
});

function identifyProvider(req) {
  //slack
  if (req.body.token) {
    for (let x = 0, i = slackConfig.length; x < i; x++ ) {
      if (slackConfig[x].verificationToken === req.body.token) {
        return { name: 'slack', position: x };
      }
    }
  }
}

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
