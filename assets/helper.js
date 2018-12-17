const response =  (replace, params, paramService, callback) => {
  let response = {
    'fulfillmentText': 'tataatt'
  //  'outputContexts': [paramService.outputContexts[ paramService.outputContexts.length-1]]

  };
  //response.outputContexts[0].lifespanCount = 0;
  //delete paramService.todo.queryResult.outputContexts;
  console.log('xxxxxxxxxxxxxxx', response);
  for (let x = 0, n = replace.length; x < n; x++ ) {
     response['fulfillmentText'] =  paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  // paramService.todo.queryResult.parameters =  paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  }
  callback.send(response);
};

module.exports = {response}
