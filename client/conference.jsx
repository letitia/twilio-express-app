import React from 'react';
import ReactDOM from 'react-dom';
import ConferenceDetail from './components/ConferenceDetail.jsx';
import ConferenceParticipantList from './components/ConferenceParticipantList.jsx';

const App = () => (
  <div>
    <ConferenceDetail />
    <ConferenceParticipantList />
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
