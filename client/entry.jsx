import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ConferenceIndex from './ConferenceIndex.jsx';

const App = () => (
  <MuiThemeProvider>
    <ConferenceIndex />
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
