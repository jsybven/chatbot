const request = require('request');

const  controller = (param, callback) => {
    if(apis[param.action]) {
      apis[param.action](param, callback);
    } else {
      callback.send('no se encontro modulo');
    }
};


const apis = {
  saludo: (param, callback) => {
   request.get(`https://slack.com/api/users.info?token=${param.token}&user=${param.user}&pretty=1`, { json: true }, (err, resp, body) => {
      if (err || !body.user) {
        param.response([', %name%'], ['']);
         return;
      }
      param.response(['%name%'], [body.user.real_name]);
   });
 }
};

//  param.response[param.keyResponse] = param.fulfillmentText.replace('/*name*/', body.user.real_name);
//  callback.send(param.response);

module.exports.controller = controller;
