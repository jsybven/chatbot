const response =  (replace, params, paramService, callback) => {
  let response = {
    'fulfillmentText': '',
    'outputContexts': [/*paramService.outputContexts[ paramService.outputContexts.length-1]*/]

  };
  delete paramService.todo.queryResult.outputContexts;
  console.log('xxxxxxxxxxxxxxx', response);
  for (let x = 0, n = replace.length; x < n; x++ ) {
   //  response['fulfillmentText'] =  paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
   paramService.todo.queryResult.parameters =  paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  }
  callback.send(paramService.todo);
};

module.exports = {response}
