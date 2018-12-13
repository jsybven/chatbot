const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override"),
      request = require('request'),
      fs = require('fs');

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
    'user': req.body.originalDetectIntentRequest.payload.data.user,
    token,
    'module': (action.indexOf('/') >-1) ? action.split('/')[0] : action,
    'action': (action.indexOf('/') >-1) ? action.split('/')[1] : action,
    'inputText': req.body.queryResult.fulfillmentText || "ocurrior un error",
    'keyResponse': 'fulfillmentText',
    'parameters': req.body.queryResult.parameters
  };
  require('./service/'+ param.module +'Service').controller(param, res);
  // requestController.callAPI(param, res);
});

router.post('/slacky', function(req, res) {
  let body = {
      url: 'https://bots.dialogflow.com/slack/7f86df03-1d7c-4238-ba5f-adfb9247116b/webhook',
      form: req.body
  }

  if(req.body.event.upload){
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
  }
  request.post(body);
  res.send({
    "challenge": req.body.challenge
  });
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
