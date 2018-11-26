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
  const action = req.body.queryResult.action;
  const textInput = req.body.queryResult.fulfillmentText;
  let param = {
    'user': req.body.originalDetectIntentRequest.payload.data.user,
    'token': 'xoxp-480772759907-481075144165-486968715861-2a946dd746f634497175aeda9cad3066',
    'module': (action.indexOf('/') >-1) ? action.split('/')[0] : action,
    'action': (action.indexOf('/') >-1) ? action.split('/')[1] : action,
    textInput,
    'keyResponse': 'fulfillmentText',
  /*  'response': {
      'fulfillmentText': ''
    },*/
    'response': (replace, params) => {
      let response = {
        'fulfillmentText': ''
      };
      for (let x = 0, n = replace.length; x < n; x++ ) {
        response['fulfillmentText'] = textInput.replace((new RegExp(replace[x], 'g') ), params[x]);
      }
      res.send(response);
    }
  };
  require('./service/'+ param.module +'Service').controller(param, res);
  // requestController.callAPI(param, res);
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
