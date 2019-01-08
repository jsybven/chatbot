const request = require('request');
const {response} = require('../assets/helper.js');

function controller(param, callback)  {
  if(param.action in apis) {
    return apis[param.action](param, callback);
  } else {
    console.log('no se encontro modulo');
    return 'Ha ocurrido un error al encontrar el modulo, por lo que esta gestion no sera posible procesarla en estos momentos. le pedimos disculpa trabajeremos para solicionarlo pronto';
  }
}

const apis = {
  saludo: (param, callback) => {
      if (param.userName) {
        return response(['%name'], [param.userName], param);
      }
      return  response([', %name'], [''], param);
  }
};
module.exports.controller = controller;
