const { WebClient } = require('@slack/client'),
      { agenteID, sessionClient, inputRequest, dialogflowRequest } = require('./dialogflow.js'),
      request = require('request'),
      structjson = require('./structjson.js'),
      fs = require('fs'),
      redis = require('redis');
const fetch = require("node-fetch");
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

function slackUserInfo (user, provider){
  return new Promise ((resolve, reject) => {
    request.get(`https://slack.com/api/users.info?token=${slackConfig[provider.position].tokenAPI}&user=${user}&pretty=1`, function(error, response, body ){
        body = JSON.parse(body);
        if (error) {
          console.error('ERROR al obtener la informacion del usuario Slack');
          console.log(error);
          reject(false);
          return;
        } else if (!body.ok) {
          console.error('ERROR al obtener la informacion del usuario Slack');
          console.log(body.error);
          reject(false);
          return;
        }
        resolve({ name: body.user.real_name, email: body.user.profile.email });
    });
  });

  /*
  const res = await fetch(`https://slack.com/api/users.info?token=${slackConfig[provider.position].tokenAPI}&user=${user}&pretty=1`);
  const body = await res.json();
  clientRedis.hmset(user, ['name', body.user.real_name,
    'email', body.user.profile.email]);*/
  //return { name: body.user.real_name, email: body.user.profile.email };
 }

function redisUserInfoSlack(user, provider) {
   return new Promise ((resolve, reject) => {
     //clientRedis.del(user);

     clientRedis.hgetall(user, function(err, result) {
       if (err) {
         console.log(err);
         reject(false);
       }
       console.log(result);
       if (!result) {
         const userInfo = slackUserInfo(user, provider).then((userInfo)=> {
           clientRedis.hmset(user, ['name', userInfo.name,
              'email', userInfo.email]);
            clientRedis.expire(user, 20 * 60);
            return userInfo;
         }).catch((err)=>{});
         if (userInfo) {
           resolve(userInfo);
         } else {
           reject(false);
         }
       }
       resolve(result);
     });
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

 async function slackProcessRequest(req, provider) {
   if (req.body.event.client_msg_id || req.body.event.upload) {
     inputRequest.queryInput.text.text = req.body.event.text;
     if (req.body.event.upload) {
        inputRequest.queryInput.text.text = req.body.event.files[0].url_private;
       /*  const fileName = body.form.event.text.split("/");
         slackDownloadFile('./temp/' + fileName[fileName.length-1], req.body.event.files[0].url_private);*/
     }
     inputRequest.session = sessionClient.sessionPath(agenteID, req.body.event.channel);
     //inputRequest.queryParams.payload = structjson.jsonToStructProto(req.body);
     provider.channel = req.body.event.channel;
     provider.slackRequestMsg = slackRequestMsg;
     provider.userInfo = await redisUserInfoSlack(req.body.event.user, provider).catch((err)=>{});
     if (provider.userInfo) {
       dialogflowRequest(inputRequest, provider);
     } else {
       msg = 'En estemos momentos no podemos autenticar su solicitud, por favor intente mas tarde';
       slackRequestMsg(msg, provider.channel, provider.position);
     }
   }
 }

module.exports.slackConfig = slackConfig;
module.exports.slackProcessRequest = slackProcessRequest;
