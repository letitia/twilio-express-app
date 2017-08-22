import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

function run() {
  const conference = {
    name: 'Conference Room 123',
    sid: 'CF5839722asdf',
    status: 'completed'
  };

  const root = <App className="conferenceList" myObj={conference} />;
  ReactDOM.render(root, document.getElementById('app'));
}

if (document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
