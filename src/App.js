import React, { Component } from 'react'
import {Button} from 'antd'
import md5 from 'md5'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
          {md5('admin')}

          <Button type="primary">{}hello</Button>
      </div>
    );
  }
}

export default App;
