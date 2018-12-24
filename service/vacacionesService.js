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
          response(['%parametros'], [`estos son los parametros: ${parameters.dateFrom}, ${parameters.dateTo}`], param, callback);
      /*  } else {
          response([', %name%'], [''], param.inputText, callback);
        }*/
     });
  },
  cancelar: (param, callback) => {
    slackInfo(param, callback, (param, callback) => {
      // aqui se debe llamar el servicio para hacer la solicitud de vacaciones
      const parameters = param.parameters;
      response(['%parametros'], [`estos son los parametros: ${param.userEmail}`], param.inputText, callback);
     });
  },
  diasDisponible: (param, callback) => {
    slackInfo(param, callback, (param, callback) => {
      // aqui se debe llamar el servicio para hacer la solicitud de vacaciones
      const parameters = param.parameters;
      response(['%dias'], [`5`], param.inputText, callback);
     });
  },
  estadoVacaciones: (param, callback) => {
    slackInfo(param, callback, (param, callback) => {
      // aqui se debe llamar el servicio para hacer la solicitud de vacaciones
      const parameters = param.parameters;
      response(['%estado'], [`rechazado`], param.inputText, callback);
     });
  },
  vacacionesLimpiar: (param, callback) => {
    slackInfo(param, callback, (param, callback) => {
      // aqui se debe llamar el servicio para hacer la solicitud de vacaciones
      param.todo.queryResult.outputContexts.forEach((item) => {
        if(item.name.indexOf('vacaciones-solicitrar') === -1){
          item.lifespanCount = 0;
        }
      });
      callback.send({
        'fulfillmentText': param.inputText,
        'outputContexts': param.todo.queryResult.outputContexts
      });
     });
  }

};

//  param.response[param.keyResponse] = param.fulfillmentText.replace('/*name*/', body.user.real_name);
//  callback.send(param.response);

module.exports.controller = controller;
