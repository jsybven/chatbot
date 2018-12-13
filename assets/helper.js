const response =  (replace, params, paramService, callback) => {
  let response = {
    'fulfillmentText': '',
    'outputContexts': ''

  };
//  console.log('xxxxxxxxxxxxxxx',  paramService);
  for (let x = 0, n = replace.length; x < n; x++ ) {
    response['fulfillmentText'] =  paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  }
  callback.send(response);
};

module.exports = {response}
