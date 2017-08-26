import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import _ from 'lodash';

class ConferenceList extends Component {
  constructor() {
    super();

    this.state = {
      conferences: []
    };
  }

  updateConferences(updatedData) {
    updatedData.forEach((updated) => {
      if (typeof updated !== 'object') return;

      let conferences = this.state.conferences.slice();
      let index;
      const existing = conferences.find((conference, i) => {
          if (conference.sid === updated.sid) {
            index = i;
            return conference;
          }
        }
      );
      if (existing) {
        if (!_.isEqual(existing, updated)) {
          conferences[index] = updated;
        } else return;
      } else {
        conferences.unshift(updated);
      }
      this.setState({ conferences: conferences });
    });
  }

  componentDidMount() {
    const hostname = location.origin.replace(/^http/, 'ws');
    const ws = new WebSocket(hostname);
    ws.addEventListener('message', (event) => {
      this.updateConferences(JSON.parse(event.data));
    });
  }

  render() {
    const { conferences } = this.state;

    if (conferences) {
      return (
        <div>
          <table>
            <thead>
              <tr>
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
    else {
      return (
        <div style={ { margin: '150px', textAlign: 'center' } }>
          <CircularProgress size={250} thickness={5} />
        </div>
      );
    }

  }
}

export default ConferenceList;