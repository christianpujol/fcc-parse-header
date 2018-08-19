// server.js
// where your node app starts

// init project
var express = require('express');
const useragent = require("express-useragent")
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/whoami", function (req, res) {
    const payload = {};

  // get the os
  payload.software = useragent.parse(req.headers['user-agent']).source;

  // get the language if any
  const language = req.headers['accept-language'];
  if (language) {
    [payload.language] = language.split(',');
  } else {
    payload.language = null;
  }

  // find the IP adress
  payload.ipaddress = req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || req.connection.socket.remoteAddress;

  // if x-forwarded-for supress the proxies
  payload.ipaddress = payload.ipaddress.replace(/,.*$/, '');
  return res.json(payload);
});


app.use(function (req, res, next) {
  res.status(404).send("not found")
})
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
