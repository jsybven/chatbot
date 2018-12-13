const request = require('request');
const {slackInfo} = require('./utilityService.js');
const {response} = require('../assets/helper.js');

const  controller = (param, callback) => {
    if(apis[param.action]) {
      apis[param.action](param, callback);
    } else {
      callback.send('no se encontro modulo');
    }
};

const apis = {
  saludo: (param, callback) => {
    slackInfo(param, callback, (param, callback) => {
        if (param.userName) {
          response(['%name%'], [param.userName], param, callback);
        } else {
          response([', %name%'], [''], param.inputText, callback);
        }
     });
  }
};

//  param.response[param.keyResponse] = param.fulfillmentText.replace('/*name*/', body.user.real_name);
//  callback.send(param.response);

module.exports.controller = controller;
