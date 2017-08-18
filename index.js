const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');
const config = require('./config/config');
const VoiceResponse = twilio.twiml.VoiceResponse;
const db = require('./models/index');

const testClient = new twilio(config.twilio.test.accountSid, config.twilio.test.authToken);
const client = new twilio(config.twilio.live.accountSid, config.twilio.live.authToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  client.conferences.list((err, conferences) => {
    // conferences.forEach((conference) => {
    //   console.log(conference)
    // });
    res.render('index', { conferences });
  });
});

app.post('/conference', (req, res) => {
  console.log('Posted to /conference!')
  const twiml = new VoiceResponse();
  const dial = twiml.dial();
  const friendlyName = `My Conference Room ${Math.ceil(Math.random() * 1000)}`;

  dial.conference(friendlyName, {
    statusCallback: '/conference/status',
    statusCallbackEvent: 'start end join leave'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/conference/status', (req, res) => {
  console.log('Posted to /conference/status', req.body.StatusCallbackEvent);
  const data = req.body;
  const Conference = db.conference;

  const createConference = (data) => {
    return Conference.create({
      name: data.FriendlyName,
      accountSid: data.AccountSid,
      conferenceSid: data.ConferenceSid
    });
  }

  if (data.StatusCallbackEvent === 'conference-start' ||
    data.StatusCallbackEvent === 'participant-join' && data.StartConferenceOnEnter === 'true') {
    createConference(data)
    .then((result) => res.send(result));
    return;
  }

  res.send('');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
