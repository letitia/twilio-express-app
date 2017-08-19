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
    res.render('index', { conferences });
  });
});

app.get('/conferences/:id', (req, res) => {
  const Conference = db.conference;
  console.log('DEBUGTISH req.params.id', req.params.id);
  Conference.find({ where: { conferenceSid: req.params.id } })
    .then(conference => res.render('conference', { conference }));
});

app.post('/conferences', (req, res) => {
  console.log('Posted to /conferences!')
  const twiml = new VoiceResponse();
  const dial = twiml.dial();
  const friendlyName = `My Conference Room ${Math.ceil(Math.random() * 1000)}`;

  dial.conference(friendlyName, {
    statusCallback: '/twilio/conferences/statuses',
    statusCallbackEvent: 'start end join leave'
  });

  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/twilio/conferences/statuses', (req, res) => {
  console.log('Posted to /twilio/conferences/statuses', req.body.StatusCallbackEvent);
  const data = req.body;
  const Conference = db.conference;

  const createConference = (data) => {
    return Conference.create({
      name: data.FriendlyName,
      accountSid: data.AccountSid,
      conferenceSid: data.ConferenceSid
    });
  }

  const createCall = (data) => {
    return Call.create({
      sid: data.sid,
      callerName: data.callerName,
      from: data.from,
      to: data.to,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      status: data.status,
      accountSid: data.AccountSid
    });
  }

  if (data.StatusCallbackEvent === 'participant-join') {
    client.calls(data.CallSid)
      .fetch()
      .then((call) => createCall(call));
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
