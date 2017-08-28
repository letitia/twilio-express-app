import React, { Component } from 'react';

class ConferenceParticipantList extends Component {
  constructor() {
    super();

    this.state = {
      calls: []
    };
  }

  componentDidMount() {
    const hostname = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(hostname);
    ws.onmessage = (event) => {
      const calls = JSON.parse(event.data);
      if (Array.isArray(calls)) {
        this.setState({ calls: calls });
      }
    }
  }

  render() {
    const { calls } = this.state;

    return (
      <div>
        <h2>Participants</h2>
          <table>
            <thead>
              <tr>
                <th>Call SID</th>
                <th>From</th>
                <th>To</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration (s)</th>
                <th>Status</th>
              </tr>
            </thead>
            { calls && 
              <tbody>
                { calls.map((call) => (
                  <tr>
                    <td>{ call.sid }</td>
                    <td>{ call.fromFormatted }</td>
                    <td>{ call.toFormatted }</td>
                    <td>{ call.startTime }</td>
                    <td>{ call.endTime }</td>
                    <td>{ call.duration }</td>
                    <td>{ call.status }</td>
                  </tr>
                )) }
              </tbody>
            }
          </table>        
      </div>
    );
  }
}

export default ConferenceParticipantList;