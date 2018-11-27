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
  solicitar: (param, callback) => {
    slackInfo(param, callback, (param, callback) => {
      // aqui se debe llamar el servicio para hacer la solicitud de vacaciones
      const parameters = param.parameters;
        //if (param.email) {
          response(['%parametros'], [`estos son los parametros: ${parameters.dateFrom}, ${parameters.dateTo}`], param.inputText, callback);
      /*  } else {
          response([', %name%'], [''], param.inputText, callback);
        }*/
     });
  }
};

//  param.response[param.keyResponse] = param.fulfillmentText.replace('/*name*/', body.user.real_name);
//  callback.send(param.response);

module.exports.controller = controller;
