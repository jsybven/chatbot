const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request'),
      fs = require('fs'),
      dialogflow = require('dialogflow'),
      redis = require('redis'),
      JSONCache = require('redis-json'),
      { WebClient } = require('@slack/client'),
      structjson = require('./structjson.js');

      const tokenPruebas = '';

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
                      session: sessionClient.sessionPath(agenteID, conversationId),
                    	queryInput: {
                    	text: { "text":"hi", "languageCode": "es" }
                    },
                    queryParams: {
                      payload: {}
                      }
                    };

function dialogflowRequest(inputRequest, channel){
//  console.log(inputRequest);
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
  return;
}

const requestController = require('./controller/requestController.js');
const token = '';

const PORT = process.env.PORT || 3100
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

let router = express.Router();

let clientRedis = redis.createClient();

clientRedis.on("error", function (err) {
    console.log("Error " + err);
});

//const jsonRedis = new JSONCache(redis, {prefix: 'cache:'});

router.get('/', function(req, res) {
   res.send("hablame el mio!");
});


router.post('/bot', function(req, res) {
  // console.log(req.body.originalDetectIntentRequest.payload.data);
  const action = req.body.queryResult.action;

/*  console.log(req.body);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log(req.body.originalDetectIntentRequest);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");*/
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




router.post('/middleware', function(req, res) {
  const en = "https://bots.dialogflow.com/slack/2a02c9ec-de56-4e7e-b103-bb7f6f6adcba/webhook";
  const es = 'https://bots.dialogflow.com/slack/7f86df03-1d7c-4238-ba5f-adfb9247116b/webhook';
  let body = {
      url: es,
      form: req.body
  }
  if (req.body.event.client_msg_id || req.body.event.upload) {
    if (req.body.event.upload) {
        body.form.event.text = req.body.event.files[0].url_private;
        const fileName = body.form.event.text.split("/");
          request.get({
                      url: body.form.event.text,
                      headers: { 'Content-Type': 'application/json',
                                 'Authorization': 'Bearer'
                               }
                      }).on( 'response', function( res ){
              res.pipe(fs.createWriteStream( './temp/' + fileName[fileName.length-1] ));
           });
    }

    inputRequest.session = sessionClient.sessionPath(agenteID, req.body.event.channel);
    inputRequest.queryInput.text.text = req.body.event.text;

    clientRedis.hgetall(req.body.event.user, function(err, result) {
      console.log(JSON.stringify(result)); // {"key":"value","second key":"second value"}
      if(!result) {
        slackUserInfo(req.body.event.user);
      }
    });
  //  console.log(jsonCache.get(req.body.event.user));
/*  clientRedis.hget(req.body.event.user, (err, res) => {
    clientRedis.watch(req.body.event.user, function( err ){
        if(err) throw err;

         /**
         * WRONG: This is now watching the keys 'foo' and 'hello'. It is not
         * watching the field 'hello' of hash 'foo'. Because the key 'foo'
         * refers to a hash, this command is now watching the entire hash
         * for modifications.

    });
    console.log('aaaaaaaaawww',res);
    if(!res) {
      slackUserInfo(req.body.event.user);
    }
  });*/
    inputRequest.queryParams.payload = structjson.jsonToStructProto(
        req.body
      )

    dialogflowRequest(inputRequest, req.body.event.channel);
  }
  res.end();
/*  res.send({
    "challenge": req.body.challenge
  });*/
});


function slackUserInfo (user){
  request.get(`https://slack.com/api/users.info?token=${token}&user=${user}&pretty=1`, function( error, response, body ){
    //  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", body);
    body = JSON.parse(body);
//console.log( body.user.real_name );
      clientRedis.hmset(user, ['name', body.user.real_name,
      'email', body.user.profile.email]);
    //  clientRedis.set(user,'email', body.user.profile.email,redis.print);
   });
}

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
