//const request = require('request');

 const  callAPI = (param, callback) => {
    if (param.intent === 'saludo') {
      return saludo(param, callback);
    }
};

function saludo  (param, callback)  {
/*  request.get(`https://slack.com/api/users.info?token=${param.token}&user=${param.user}&pretty=1`, { json: true }, (err, resp, body) => {
     if (err || !body.user) {
        fulfillmentText.fulfillmentText = param.fulfillmentText.replace(' ${name}', '');
        callback.send(fulfillmentText);
        return;
     }
     fulfillmentText.fulfillmentText = param.fulfillmentText.replace('${name}', body.user.real_name);
     callback.send(fulfillmentText);
  });*/
}

const fulfillmentText = {
  'fulfillmentText': ''
}
module.exports.callAPI = callAPI;
