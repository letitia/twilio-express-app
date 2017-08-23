import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import ConferenceList from './ConferenceList.jsx';

function run() {
  const root = <ConferenceList className="conference-list" />;
  ReactDOM.render(root, document.getElementById('app'));
}

if (document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
