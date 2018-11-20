var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    methodOverride = require("method-override");
  //  mongoose = require('mongoose');
const PORT = process.env.PORT || 3100
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

var router = express.Router();

router.get('/', function(req, res) {
   res.send("Hello World!");
});

router.post('/vacaciones', function(req, res) {
  //console.log(req.body);
  //req.body.queryResult.fulfillmentMessages[0].text.text = ["bueno chao"];
  console.log(req.body.queryResult);
   res.send({
      "fulfillmentText": "This is a text response",
  });
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
