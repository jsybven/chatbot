const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request'),
      fs = require('fs'),
      dialogflow = require('dialogflow'),
      { WebClient } = require('@slack/client');

      const tokenPruebas = 'xoxb-480772759907-4919652910';

const sessionClient = new dialogflow.SessionsClient();
let rtm;

function setSlackTokens() {
//la key del JSON es el teamID de slack y esta almacenando la instacia de slack
  web = new WebClient(tokenPruebas);
//  rtm.start();
}
setSlackTokens();


const conversationId = 'DEYRELQ66',
      agenteID = 'newagent-a6d67';


//const sessionPath = sessionClient.sessionPath(agenteID, conversationId);
let inputRequest = {
                      'session': sessionClient.sessionPath(agenteID, conversationId),
                    	"queryInput": {
                    	"text": { "text":"hi", "languageCode": "es" }
                    },
                    queryParams: {
                      "payload": {
                        	"data": {
                    		    "emailUser": "Jeeeeeeypi@hoooootomail.com",

                        	}
                    	}
                    }
                    };

function dialogflowRequest(inputRequest, channel){
  sessionClient
  .detectIntent(inputRequest)
  .then(responses => {
    const result = responses[0].queryResult;
  //  console.log(`  Response: ${result.fulfillmentText}`);
    slackRequestMsg(result.fulfillmentText, channel);
    return;
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

function slackRequestMsg(msg, channel){
  web.chat.postMessage({ channel: channel, text: msg } ).catch(console.error);
}

const requestController = require('./controller/requestController.js');
const token = 'xoxp-480772759907-481075144165-510383631296-d8721e2ca520fdd10fbcbb33ba8ccd10';

const PORT = process.env.PORT || 3100
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
   res.send("hablame el mio!");
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
 //console.log( req.body);
//console.log( "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

//console.log("qqqqq", req.body.event.upload , req.body.event.client_msg_id);
if (req.body.event.client_msg_id || req.body.event.upload) {
  //console.log("qqqqq", req.body.event.upload);
  if (req.body.event.upload) {

      body.form.event.text = req.body.event.files[0].url_private;
    //  console.log(body.form.event.text);
      const fileName = body.form.event.text.split("/");
      //  este codigo es para descargar el archivo
        request.get({
                    url: body.form.event.text,
                    headers: { 'Content-Type': 'application/json',
                               'Authorization': 'Bearer xoxb-480772759907-491965291030-MhnPEkkcQ2mkt0bI91zb0wZh'
                             }
                    }).on( 'response', function( res ){
            res.pipe(fs.createWriteStream( './temp/' + fileName[fileName.length-1] ));
         });
  }

    inputRequest.session = sessionClient.sessionPath(agenteID, req.body.event.channel);
    inputRequest.queryInput.text.text = req.body.event.text;

    dialogflowRequest(inputRequest, req.body.event.channel);
  }
  res.end();
/*  res.send({
    "challenge": req.body.challenge
  });*/
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
