const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const twilio = require('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;
const db = require('./models/index');
const PORT = process.env.PORT || 80;
const SocketServer = require('ws').Server;

const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const wsServer = new SocketServer({ server });

wsServer.on('connection', (ws) => {
  console.log('Client connected to ws');
  wsServer.on('close', () => console.log('Client disconnected'));
});

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
  const twiml = new VoiceResponse();
  const dial = twiml.dial();
  const Conference = db.conference;
  let friendlyName = 'Conference Room 1';
  let lastConference;

  Conference.findOne({
    order: [['createdAt', 'DESC']]
  })
  .then((result) => {
    lastConference = result;
    if (lastConference) {
      if (lastConference.get('status') === 'in-progress') {
        friendlyName = lastConference.get('name');
      } else {
        const newNumber = lastConference.get('name').replace(/Conference Room (\d+)/g, (match, num) => parseInt(num)+1);
        if (!isNaN(parseInt(newNumber))) {
          friendlyName = `Conference Room ${newNumber}`;
        }
      }
    }

    dial.conference(friendlyName, {
      statusCallback: '/twilio/conferences/statuses',
      statusCallbackEvent: 'start end join leave'
    });

    res.type('text/xml');
    res.send(twiml.toString());
  });
});

const testAccountSid = process.env.TWILIO_TEST_ACCOUNT_SID;
const testAuthToken = process.env.TWILIO_TEST_AUTH_TOKEN;
const testClient = new twilio(testAccountSid, testAuthToken);
const liveAccountSid = process.env.TWILIO_ACCOUNT_SID;
const liveAuthToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(liveAccountSid, liveAuthToken);

app.post('/twilio/conferences/statuses', (req, res) => {
  console.log('Posted to /twilio/conferences/statuses', req.body.StatusCallbackEvent);
  const reqData = req.body;
  const Conference = db.conference;
  const Call = db.call;

  const createConference = (data) => (
    Conference.create({
      name: data.FriendlyName,
      accountSid: data.AccountSid,
      sid: data.ConferenceSid,
      status: 'in-progress'
    })
  );

  const updateConferenceEnd = (data) => (
    Conference.update({
      status: 'completed'
    }, {
      where: { sid: data.ConferenceSid }
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
      .then((conference) => {
        wsServer.clients.forEach((client) => client.send(JSON.stringify(conference)));
      });
  }

  if (reqData.StatusCallbackEvent === 'conference-end') {
    updateConferenceEnd(reqData)
      .then((conference) => {
        wsServer.clients.forEach((client) => client.send(JSON.stringify(conference)));
      });
  }

  res.send('');
});
