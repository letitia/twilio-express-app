import React, { Component } from 'react';
import _ from 'lodash';

class ConferenceDetail extends Component {
    constructor() {
    super();

    this.state = {
      conference: {}
    };
  }

  componentDidMount() {
    const hostname = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(hostname);
    ws.addEventListener('message', (event) => {
      const conference = JSON.parse(event.data);
      if (!Array.isArray(conference)) {
        this.setState({ conference: conference });
      }
    });
  }

  render() {
    const { conference } = this.state;

    return (
      <div>
        <h2>Conference Details</h2>
        { !_.isEmpty(conference) &&
          <table>
            <tr>
              <td><strong>Conference SID</strong></td>
              <td>{ conference.sid }</td>
            </tr>
            <tr>
              <td><strong>Account SID</strong></td>
              <td>{ conference.accountSid }</td>
            </tr>
            <tr>
              <td><strong>Created At</strong></td>
              <td>{ conference.createdAt }</td>
            </tr>
          </table>
        }
      </div>
    );
  }
}

export default ConferenceDetail;