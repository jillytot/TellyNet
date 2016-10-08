
const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('TellyNet is up and running');
});

const server = app.listen(8081, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('TellyNet activated http://%s:%s', host, port);
});
