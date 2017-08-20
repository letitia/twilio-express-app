const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const db = require('./models/index');
const port = process.env.PORT || 80;

const testAccountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
const liveAccountSid = process.env.TWILIO_ACCOUNT_SID;
const testAuthToken = process.env.TWILIO_TEST_AUTH_TOKEN;
const liveAuthToken = process.env.TWILIO_AUTH_TOKEN;
const testClient = new twilio(testAccountSid, testAuthToken);
const client = new twilio(liveAccountSid, liveAuthToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  const Conference = db.conference;
  Conference.findAll({
    order: [['createdAt', 'DESC']]
  })
  .then(conferences => {
    const viewSpec = {
      conferences,
      phoneNumber: process.env.TWILIO_ACCOUNT_PHONE_NUMBER
    };
    res.render('index', viewSpec);
  });
});

app.get('/conferences/:id', (req, res) => {
  const Conference = db.conference;
  const Call = db.call;
  const conference = Conference.findById(req.params.id);
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
  const friendlyName = 'My Conference Room';

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

  const createConference = (data) => (
    Conference.create({
      name: data.FriendlyName,
      accountSid: data.AccountSid,
      sid: data.ConferenceSid
    })
  );

  const createCall = (data) => (
    Call.create({
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
    })
  );

  const updateCallEnd = (data) => (
    Call.update({
      endTime: data.endTime,
      duration: data.duration,
      status: data.status
    }, {
      where: { sid: data.sid }
    })
  );

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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
