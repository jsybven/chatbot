const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request'),
      fs = require('fs'),
      dialogflow = require('dialogflow'),
      { RTMClient } = require('@slack/client');

      const tokenPruebas = 'xoxb-480772759907-508864702578-nzva5YUC9E3mKSRwO';

const sessionClient = new dialogflow.SessionsClient();
let rtm;

function setSlackTokens() {
//la key del JSON es el teamID de slack y esta almacenando la instacia de slack
  rtm = new RTMClient(tokenPruebas);
  rtm.start();
}
setSlackTokens();


const conversationId = 'DEEDKPQR1',
      agenteID = 'newagent-a6d67';


const sessionPath = sessionClient.sessionPath(agenteID, conversationId);
let inputRequest = {
                      'session': sessionPath,
                    	"queryInput": {
                    	"text": { "text":"hi", "languageCode": "es" }
                    	}
                    };

function dialogflowRequest(inputRequest, channel){
  sessionClient
  .detectIntent(inputRequest)
  .then(responses => {
    const result = responses[0].queryResult;
    console.log(`  Response: ${result.fulfillmentText}`);
    slackRequestMsg(result.fulfillmentText, conversationId);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

function slackRequestMsg(msg, channel){
  rtm.sendMessage(msg, channel)
    .then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res);
    })
    .catch(console.error);
}

const requestController = require('./controller/requestController.js');
const token = 'xoxp-480772759907-491402602871-503248437139-596aa4e92ed76024a9ac65c2d5f0ce53';

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
    'user': 'el jean', // req.body.originalDetectIntentRequest.payload.data.user,
    token,
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










router.post('/slacky', function(req, res) {
  const en = "https://bots.dialogflow.com/slack/2a02c9ec-de56-4e7e-b103-bb7f6f6adcba/webhook";
  const es = 'https://bots.dialogflow.com/slack/7f86df03-1d7c-4238-ba5f-adfb9247116b/webhook';
  let body = {
      url: es,
      form: req.body
  }
console.log( req.body);
console.log( "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
//console.log( res.body);
/*  if(req.body.event.upload){
      const linkDownload = req.body.event.files[0].permalink_public.split('/')[3].split('-');
      const fileName = req.body.event.files[0].name.toLowerCase().replace(/ /g, '_');
      body.form.event.text = `https://files.slack.com/files-pri/${linkDownload[0]}-${linkDownload[1]}/${fileName}?pub_secret=${linkDownload[2]}`;
      console.log(body.form.event.text);
      request.get('https://slack.com/api/files.sharedPublicURL?token=' + token + '&file='+req.body.event.files[0].id+'&pretty=1', function(reqs, resp) {
      //  console.log(resp.body);
        request.get(body.form.event.text).on( 'response', function( res ){
            res.pipe(fs.createWriteStream( './temp/' + fileName ));
         });
      });
  }/*
const cuerpo = {
  url: 'https://dialogflow.googleapis.com/v2/projects/newagent-a6d67/agent/sessions/d81e3c6d-3e7c-e501-adc5-dc4a83ca3ce9:detectIntent',
  body: {"queryInput":{
	"text":{"text":"hi","languageCode":"en"}
	}
},
headers: {
  Authorization: "Authorization: Bearer ya29.c.Elp1BrYQjumhuCL04qvmNvcsvge7xk-VoUX4xujO26pO7ypC_SMv6K7d7rH0Dao9S6u0vHCiPNTxEEgCLRVN1UBO9iSQE_sXx9Q9ftu0duzPBcsVWv_Ht4CylYU",
  "Content-Type": "application/json"
}
}

request.post(cuerpo, function(error, response, body){
  if (!error && response.statusCode == 200) {
      // Print out the response body
      console.log(body)
  } else
  console.log("maaaaaaaaaaaaal");
});*/

inputRequest.session = sessionClient.sessionPath(agenteID, req.body.event.channel);
inputRequest.queryInput.text.text = req.body.event.text;
//dialogflowRequest(inputRequest, req.body.event.channel);
  res.send({
    "challenge": req.body.challenge
  });
});

router.get('/slacky', function(req, res) {
  console.log(req.body);
  console.log("********************");
  //console.log(res);
  res.send({
  });
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
