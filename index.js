const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/conference', (req, res) => {
  console.log('Posted to /conference!')
  const phoneNumber = req.body.From;
  const input = req.body.RecordingUrl || req.body.Digits;
  const twiml = new VoiceResponse();
  const dial = twiml.dial();
  dial.conference('My Conference Room 01');
  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
