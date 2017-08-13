const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');
const config = require('./config/config');
const VoiceResponse = twilio.twiml.VoiceResponse;

const testClient = new twilio(config.twilio.test.accountSid, config.twilio.test.authToken);
const client = new twilio(config.twilio.live.accountSid, config.twilio.live.authToken);

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

app.post('/call', (req, res) => {
  client.api.calls.create({
    url: `http:\/\/${req.hostname}/voicemessage`,
    to: config.phoneNumbers.self,
    from: config.phoneNumbers.account
  })
  .then((call) => console.log(call.sid));
});

app.post('/voicemessage', (req, res) => {
  const twiml = new VoiceResponse();
  twiml.say({ voice: 'alice' }, 'Hi honey. Shall we get pizza now?');
  twiml.play('http://demo.twilio.com/docs/classic.mp3');
  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
