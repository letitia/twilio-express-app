import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ConferenceDetail from './components/ConferenceDetail.jsx';
import ConferenceParticipantList from './components/ConferenceParticipantList.jsx';

const App = () => (
  <MuiThemeProvider>
    <div>
      <ConferenceDetail />
      <ConferenceParticipantList />
    </div>
  </MuiThemeProvider>
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
