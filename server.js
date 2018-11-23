const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request');

const requestController = require('./controller/requestController.js');

  //  mongoose = require('mongoose');
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
  // token virtualmind  'xoxp-42109645268-466940612869-485366849493-6652ad826a2671ed53e9f2b29482f445';
  let param = {
    'user': req.body.originalDetectIntentRequest.payload.data.user,
    'token': 'xoxp-480772759907-481075144165-486968715861-2a946dd746f634497175aeda9cad3066',
    'intent': req.body.queryResult.intent.displayName,
    'fulfillmentText': req.body.queryResult.fulfillmentText
  };
   requestController.callAPI(param, res);
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
