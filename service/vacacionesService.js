const request = require('request');

const  controller = (param, callback) => {
    if(apis[param.action]) {
      apis[param.action](param, callback);
    } else {
      callback.send('no se encontro modulo');
    }
};

const apis = {
  solicitar: er(param, callback (param, callback) => {
     request.get(`https://slack.com/api/users.info?token=${param.token}&user=${param.user}&pretty=1`, { json: true }, (err, resp, body) => {
        if (err || !body.user) {
          param.response([', %name%'], ['']);
           return;
        }
        //callback.send("en estos momentos no podemos procesar tu solicitud intente mas tarde");
          console.log(body.user.profile.email);
        param.response(['%name%'], [body.user.real_name]);
     });
   )
 }
};

const er = (param, callback, function ) => {
  request.get(`https://slack.com/api/users.info?token=${param.token}&user=${param.user}&pretty=1`, { json: true }, (err, resp, body) => {
     if (err || !body.user) {
        callback.send("En estos momentos no podemos procesar tu solicitud. Por fabor intente más tarde");
        return;
     }
     param.email = body.user.profile.emailñ
     param.name = body.user.real_name
     function(param, callback);
  });
}

//  param.response[param.keyResponse] = param.fulfillmentText.replace('/*name*/', body.user.real_name);
//  callback.send(param.response);

module.exports.controller = controller;
