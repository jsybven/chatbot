const { WebClient } = require('@slack/client'),
      { agenteID, sessionClient, inputRequest, dialogflowRequest } = require('./dialogflow.js'),
      request = require('request'),
      structjson = require('./structjson.js'),
      fs = require('fs'),
      redis = require('redis');

require('dotenv').config();

const clientRedis = redis.createClient();
clientRedis.on("error", function (err) {
    console.log("REDIS Error " + err);
});

const slackConfig = [{
  company: process.env.VM_COMPANY,
  tokenBotUser: process.env.VM_TOKEN_BOT_USER,
  tokenAPI: process.env.VM_TOKEN_API,
  verificationToken: process.env.VM_VERIFICATION_TOKEN,
  slackClientIntance: ''
}];
slackConfig.forEach((item) => { item.slackClientIntance = new WebClient(item.tokenBotUser) });

function slackRequestMsg(msg, channel, position){
  slackConfig[position].slackClientIntance.chat.postMessage({ channel: channel, text: msg } ).catch(console.error);
  return;
}

function slackUserInfo (user, position){
  request.get(`https://slack.com/api/users.info?token=${slackConfig[position].tokenAPI}&user=${user}&pretty=1`, function( error, response, body ){
      body = JSON.parse(body);
      clientRedis.hmset(user, ['name', body.user.real_name,
        'email', body.user.profile.email]);
   });
 }

 function redisUserInfoSlack(user) {
   clientRedis.hgetall(user, function(err, result) {
     if (err) {
       console.log(err);
     }
     if (!result) {
       return slackUserInfo(user);
     }
     return result;
   });
 }

// el path debera incluir el nombre del archivo y su extencion
 function slackDownloadFile (path, url, position) {
   request.get({
               url,
               headers: { 'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + slackConfig[position].tokenBotUser
                        }
               }).on( 'response', function( res ){
       res.pipe(fs.createWriteStream( path ));
    });
 }

 function slackProcessRequest(req, provider) {
   if (req.body.event.client_msg_id || req.body.event.upload) {
     inputRequest.queryInput.text.text = req.body.event.text;
     if (req.body.event.upload) {
        inputRequest.queryInput.text.text = req.body.event.files[0].url_private;
       /*  const fileName = body.form.event.text.split("/");
         slackDownloadFile('./temp/' + fileName[fileName.length-1], req.body.event.files[0].url_private);*/
     }
     inputRequest.session = sessionClient.sessionPath(agenteID, req.body.event.channel);
     inputRequest.queryParams.payload = structjson.jsonToStructProto(req.body);
     const papa = redisUserInfoSlack(req.body.event.user, provider.position);
     console.log('elll mio ', papa);
     provider.channel = req.body.event.channel;
     provider.slackRequestMsg = slackRequestMsg;
     dialogflowRequest(inputRequest, provider);
   }
 }

module.exports.slackConfig = slackConfig;
module.exports.slackProcessRequest = slackProcessRequest;
