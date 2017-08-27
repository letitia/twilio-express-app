import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Table, { TableBody, TableHeader, TableRow, TableHeaderColumn, TableRowColumn } from 'material-ui/Table';
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
    ws.onmessage = (event) => {
      this.updateConferences(JSON.parse(event.data));
    }
  }

  render() {
    const { conferences } = this.state;

    if (conferences) {
      return (
        <div>
          <Table>
            <TableHeader displaySelectAll={ false } adjustForCheckbox={ false }>
              <TableRow>
                <TableHeaderColumn>Friendly Name</TableHeaderColumn>
                <TableHeaderColumn>Conference SID</TableHeaderColumn>
                <TableHeaderColumn>Date Created</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={ false }>
              { conferences.map((conference) => (
                <TableRow key={ conference.sid }>
                  <TableRowColumn><a href={`conferences/${conference.sid}`}>{ conference.name }</a></TableRowColumn>
                  <TableRowColumn>{ conference.sid }</TableRowColumn>
                  <TableRowColumn>{ conference.createdAt }</TableRowColumn>
                  <TableRowColumn>{ conference.status }</TableRowColumn>
                </TableRow>
              )) }
            </TableBody>
          </Table>
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