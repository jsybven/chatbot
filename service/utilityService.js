const request = require('request');

const slackInfo = (param, callback, callingApi ) => {
 request.get(`https://slack.com/api/users.info?token=${param.token}&user=${param.user}&pretty=1`, { json: true }, (err, resp, body) => {
   // esto se debera descomentar.. permite que se muestre ese mensaje al usuario cuando no se logra comprobar quien es el usuario
   
/*    if (err || !body.user) {
       callback.send("En estos momentos no podemos procesar tu solicitud. Por fabor intente más tarde");
       return;
    }
    param.userEmail = body.user.profile.email;
    param.userName = body.user.real_name;*/
    callingApi(param, callback);
 });
}

module.exports = {slackInfo};
