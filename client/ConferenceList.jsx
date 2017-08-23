import React, { Component } from 'react';

class ConferenceList extends Component {
  constructor() {
    super();

    this.state = {
      conferences: []
    };
  }

  componentDidMount() {
    const hostname = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(hostname);
    ws.onmessage = (event) => {
      const conferenceData = JSON.parse(event.data);

      this.setState({
        conferences: conferenceData.concat(this.state.conferences)
      });
    }
  }

  render() {
    const { conferences } = this.state;

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th />
              <th>Friendly Name</th>
              <th>Conference SID</th>
              <th>Date Created</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            { conferences.map((conference) => (
              <tr key={ conference.sid }>
                <td><a href={`conferences/${conference.sid}`}>{ conference.name }</a></td>
                <td>{ conference.sid }</td>
                <td>{ conference.createdAt }</td>
                <td>{ conference.status }</td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    );
  }
}

export default ConferenceList;