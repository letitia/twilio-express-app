import React from 'react';
import ReactDOM from 'react-dom';

function run() {
  const root = (<h1>Hello world</h1>);
  ReactDOM.render(root, document.getElementById('app'));
}

if (document.body) {
  run();
} else {
  window.addEventListener('DOMContentLoaded', run, false);
}
