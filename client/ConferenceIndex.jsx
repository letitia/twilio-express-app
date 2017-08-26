import React, { Component } from 'react';
import ConferenceList from './ConferenceList.jsx';
const phoneNumber = process.env.TWILIO_ACCOUNT_PHONE_NUMBER;

const ConferenceIndex = () => (
  <div style={ { width: '800px', marginLeft: 'auto', marginRight: 'auto' } }>
    <h2>Conferences</h2>
    <p>Instructions: Try calling { phoneNumber } and watch as a new Conference is created.</p>
    <ConferenceList />
  </div>
);

export default ConferenceIndex;