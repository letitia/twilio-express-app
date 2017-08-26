import React, { Component } from 'react';
import ConferenceList from './ConferenceList.jsx';
// import * as styles from './stylesheets/ConferenceIndex.css';

const phoneNumber = process.env.TWILIO_ACCOUNT_PHONE_NUMBER;

const ConferenceIndex = () => (
  <div style={ { width: '1000px' } }>
    <h2>Conferences</h2>
    <p>Instructions: Try calling { phoneNumber } and watch as a new Conference is created.</p>
    <ConferenceList />
  </div>
);

export default ConferenceIndex;