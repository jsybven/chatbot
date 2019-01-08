const express = require("express"),
      app = express(),
      bodyParser  = require("body-parser"),
      methodOverride = require("method-override");

const PORT = process.env.PORT || 3000;
let router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());


router.get('/prueba', function(req, res) {
   res.send({dias: 10});
});

app.use(router);

app.listen(PORT, function() {
  console.log("Node server running on http://localhost:" + PORT);
});
