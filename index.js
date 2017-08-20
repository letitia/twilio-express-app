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
    const viewSpec = {
      conferences,
      phoneNumber: config.phoneNumbers.accountFormatted
    };
    res.render('index', viewSpec);
  });
});

app.get('/conferences/:id', (req, res) => {
  const Conference = db.conference;
  const Call = db.call;
  const conference = Conference.find({ where: { sid: req.params.id } });
  const call = Call.findAll({ where: { conferenceSid: req.params.id } });
  Promise.all([conference, call]).then(values => {
    const viewSpec = {
      conference: values[0],
      calls: values[1]
    };
    res.render('conference', viewSpec);
  });
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
  const reqData = req.body;
  const Conference = db.conference;
  const Call = db.call;

  const createConference = (data) => {
    return Conference.create({
      name: data.FriendlyName,
      accountSid: data.AccountSid,
      sid: data.ConferenceSid
    });
  }

  const createCall = (data) => {
    return Call.create({
      sid: data.sid,
      callerName: data.callerName,
      from: data.from,
      fromFormatted: data.fromFormatted,
      to: data.to,
      toFormatted: data.toFormatted,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      status: data.status,
      accountSid: data.accountSid,
      conferenceSid: reqData.ConferenceSid
    });
  }

  const updateCallEnd = (data) => {
    return Call.update({
      endTime: data.endTime,
      duration: data.duration,
      status: data.status
    }, {
      where: { sid: data.sid }
    });
  }

  if (reqData.StatusCallbackEvent === 'participant-join') {
    client.calls(reqData.CallSid)
      .fetch()
      .then((call) => createCall(call));
  }

  if (reqData.StatusCallbackEvent === 'participant-leave') {
    client.calls(reqData.CallSid)
      .fetch()
      .then((call) => updateCallEnd(call));
  }

  if (reqData.StatusCallbackEvent === 'conference-start' ||
    reqData.StatusCallbackEvent === 'participant-join' && reqData.StartConferenceOnEnter === 'true') {
    createConference(reqData)
      .then((result) => res.send(result));
    return;
  }

  res.send('');
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
