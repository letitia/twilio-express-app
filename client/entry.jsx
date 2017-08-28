import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

function run() {
  const root = <App />;
  ReactDOM.render(root, document.getElementById('app'));
}

if (document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
