function response (replace, params, paramService) {
  for (let x = 0, n = replace.length; x < n; x++ ) {
     paramService.inputText = paramService.inputText.replace((new RegExp(replace[x] || '', 'g') ), params[x]);
  }
  return paramService.inputText;
};

module.exports = {response}
