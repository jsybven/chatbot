const response =  (replace, params, paramService, callback) => {
  let response = {
    'fulfillmentText': '',
    'outputContexts': [paramService.outputContexts[ paramService.outputContexts.length-1]]

  };
  console.log('xxxxxxxxxxxxxxx', response);
  for (let x = 0, n = replace.length; x < n; x++ ) {
    response['fulfillmentText'] =  paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  }
  callback.send(response);
};

module.exports = {response}
