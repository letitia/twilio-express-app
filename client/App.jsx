import React, { Component } from 'react';
import PropTypes from 'prop-types';

class App extends Component {
  static propTypes = {
    className: PropTypes.string,
    myObj: PropTypes.object
  };

  render() {
    console.log('this.props', this.props);
    const { myObj, ...remainingProps } = this.props;

    console.log({ myObj });
    console.log({ remainingProps });

    return (
      <h1 {...remainingProps}>Hello, Adele!</h1>
    );
  }
}

export default App;