 const  callAPI = (param, callback) => {
   require('../service/'+ param.intent +'Service').controller(param, callback);
};

module.exports.callAPI = callAPI;
