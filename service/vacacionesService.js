const request = require('request');
const {response} = require('../assets/helper.js');
const dialogflow = require('dialogflow');
const axios = require('axios');

const contextsClient = new dialogflow.ContextsClient();

function controller(param, callback)  {
  if(param.action in apis) {
    return apis[param.action](param, callback);
  } else {
    console.log('no se encontro modulo');
    return 'Ha ocurrido un error al encontrar el modulo, por lo que esta gestion no sera posible procesarla en estos momentos. le pedimos disculpa trabajeremos para solicionarlo pronto';
  }
}

const apis = {
  solicitar: (param, callback) => {
    const parameters = param.parameters;
    response(['%parametros'], [`estos son los parametros: ${parameters.dateFrom}, ${parameters.dateTo}`], param);
  },
  cancelar: (param, callback) => {
    // aqui se debe llamar el servicio
    const parameters = param.parameters;
    response(['%parametros'], [`estos son los parametros: ${param.userEmail}`], param);
  },
  diasDisponible: (param, callback) => {
    return axios.get('http://localhost:3000/prueba').then((res) => {
       return response(['%dias'], [res.data.dias], param);
    }).catch((res)=>{
      return 'en estos momentos no hes posible procesar su solicitud, por favor intente mas tarde';
    });
  },
  estadoVacaciones: (param, callback) => {
    // aqui se debe llamar el servicio
    const parameters = param.parameters;
    response(['%estado'], [`rechazado`], param);
  },
  vacacionesLimpiar: (param, callback) => {
    // aqui se debe llamar el servicio
    param.todo.queryResult.outputContexts.forEach(async (item) => {
      if(Object.keys(item.parameters).length > 6){
        await contextsClient.deleteContext({ name: item.name });
      }
    });
  }
};

module.exports.controller = controller;
