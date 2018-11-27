const response =  (replace, params, inputText, callback) => {
  let response = {
    'fulfillmentText': ''
  };
  for (let x = 0, n = replace.length; x < n; x++ ) {
    response['fulfillmentText'] = inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  }
  callback.send(response);
};

module.exports = {response}
