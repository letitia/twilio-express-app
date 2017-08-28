import React from 'react';
import ReactDOM from 'react-dom';
import ConferenceList from './components/ConferenceList.jsx';

const phoneNumber = process.env.TWILIO_ACCOUNT_PHONE_NUMBER;

const App = () => (
  <div>
    <h2>Conferences</h2>
    <p>Instructions: Try calling { phoneNumber } and watch as a new Conference is created.</p>
    <ConferenceList />
  </div>
);

function run() {
  const root = <App />;
  ReactDOM.render(root, document.getElementById('app'));
}

if (document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
