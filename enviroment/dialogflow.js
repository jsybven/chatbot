const dialogflow = require('dialogflow');
require('dotenv').config();

const sessionClient = new dialogflow.SessionsClient();
const conversationId = 'DEYRELQ66',
      agenteID = process.env.AGENT_ID;

let inputRequest = {
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
  .then(responses => {
    const result = responses[0].queryResult;
    if (provider.name === 'slack') {
      provider.slackRequestMsg(result.fulfillmentText, provider.channel, provider.position);
    }
    return;
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}

module.exports.agenteID = agenteID;
module.exports.sessionClient = sessionClient;
module.exports.inputRequest = inputRequest;
module.exports.dialogflowRequest = dialogflowRequest;
