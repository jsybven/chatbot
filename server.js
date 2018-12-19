const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request'),
      fs = require('fs');
/*      const Botkit = require('botkit');
      const dialogflowMiddleware = require('botkit-middleware-dialogflow')({
        keyFilename: './newason'  // service account private key file from Google Cloud Console
      });


      const slackController = Botkit.slackbot();
      const slackBot = slackController.spawn({
        token: 'xoxp-480772759907-491402602871-506513762',  // Slack API Token
      });

      slackController.middleware.receive.use(dialogflowMiddleware.receive);
      slackBot.startRTM();
      console.log(slackController);
      slackController.hears('hello-intent', 'direct_message', dialogflowMiddleware.hears, function(bot, message) {
        console.log("DSFdfd");
      });
*/





      /*
      const dialogflow = require('dialogflow');
const sessionClient = new dialogflow.SessionsClient();

// Define session path
const sessionPath = sessionClient.sessionPath("newagent-a6d67", "d81e3c6d-3e7c-e501-adc5-dc4a83ca3ce9");
console.log(sessionPath);
curl -H "Content-Type: application/json; charset=utf-8"  -H "Authorization: Bearer ya29.c.Elp2BnssTCcsettfwcL5qk2YOkRIn70YIE1Clhd2OLHc_a09uEuo9sE7PrFU5kZEtM8O6YxSOVtP2my7eMLPgTMaJfXY5ekoUMUjvcYYxcbdm58dQtHQ68t0zv4"  -d "{\"queryInput\":{\"text\":{\"text\":\"hi\",\"languageCode\":\"es\"}},\"queryParams\":{\"timeZone\":\"America/Buenos_Aires\"}}" "https://dialogflow.googleapis.com/v2beta1/projects/newagent-a6d67/agent/sessions/d81e3c6d-3e7c-e501-adc5-dc4a83ca3ce9:detectIntent"
sessionClient
  .detectIntent({
  "session": sessionPath,
	"queryInput":{
	"text":{"text":"hi", "languageCode":"en"}
	},
	"queryParams": {

           "payload": {
    	"data": {
		    "client_msg_id": "f7723fa8-a99b-4c17-a943-61c27dcab25b",
			"event_ts": "1542745438.007900",
			"channel": "DE7763PV4",
			"text": "hi",
			"type": "message",
			"channel_type": "im",
			"user": "UE527484V",
			"ts": "1542745438.007900"
    	}
	}

        }
}
)
  .then(responses => {
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
*/
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
console.log( res.body);
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
  request.post(body);
  res.send({
    "challenge": req.body.challenge
  });
});

router.get('/slacky', function(req, res) {
  console.log(req.body);
  console.log("********************");
  console.log(res.body);
  res.send({
  });
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
