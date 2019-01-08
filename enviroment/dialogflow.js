const dialogflow = require('dialogflow');
require('dotenv').config();

const sessionClient = new dialogflow.SessionsClient();
const contextsClient = new dialogflow.ContextsClient();
const conversationId = 'DEYRELQ66',
      agenteID = process.env.AGENT_ID;

const inputRequest = {
  session: sessionClient.sessionPath(agenteID, conversationId),
	queryInput: {
	   text: { "text":"hi", "languageCode": "es" }
  },
  queryParams: {
    payload: {}
  }
};

function dialogflowRequest(inputRequest, provider){
  sessionClient
  .detectIntent(inputRequest)
  .then(async (response) => {
  //  console.log(response);
    let text = inputRequest.fulfillmentText
    const result = response[0].queryResult;
    if (result.action) {
       console.log(result.action);
       response[0].queryResult.userInfo = provider.userInfo;
       text = await processAction(response[0]);
    }

    if (provider.name === 'slack') {
      console.log(text);
      provider.slackRequestMsg(text, provider.channel, provider.position);
    }
    return;
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

function processAction(req) {
  const action = req.queryResult.action;
  let param = {
    'userName': req.queryResult.userInfo.name, // req.originalDetectIntentRequest.payload.data.user,
    'userEmail': req.queryResult.userInfo.email,
    'module': (action.indexOf('/') >-1) ? action.split('/')[0] : action,
    'action': (action.indexOf('/') >-1) ? action.split('/')[1] : action,
    'inputText': req.queryResult.fulfillmentText || "ocurrior un error",
    'keyResponse': 'fulfillmentText',
    'parameters': req.queryResult.parameters,
    'outputContexts': req.queryResult.outputContexts,
    'todo': req
  };
   return require('../service/' + param.module + 'Service').controller(param);
}

module.exports.agenteID = agenteID;
module.exports.sessionClient = sessionClient;
module.exports.inputRequest = inputRequest;
module.exports.dialogflowRequest = dialogflowRequest;
