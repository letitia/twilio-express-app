import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ConferenceIndex from './ConferenceIndex.jsx';
import ConferenceDetail from './ConferenceDetail.jsx';

const PAGES = {
  '/': 'ConferenceIndex',
  '/conferences/:sid': 'Conference',
};

class App extends Component {
  static propTypes = {
    pathname: PropTypes.oneOf(Object.keys(PAGES)).isRequired,
  };

  render() {
    const Handler = PAGES[this.prop.pathname];

    return (
      <h1 {...remainingProps}>Hello, Adele!</h1>
    );
  }
}

export default App;