import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ipfs from './ipfs';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleAdd = async (event) => {
    event.preventDefault();

    let ipfsContent = {
      path: '/buidlams/buidl.txt',
      content: ipfs.types.Buffer.from(JSON.stringify(this.state.value))
    };

    let results = await ipfs.add(ipfsContent);
    let hash = results[0].hash;
    console.log("IPFS hash: " + hash);
    console.log("Address: https://gateway.ipfs.io/ipfs/" + hash);
  }

  handleRead = async (event) => {
    event.preventDefault();

    let file = await ipfs.cat(this.state.value);
    console.log(file.toString('utf8'));
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <form onSubmit={this.handleAdd}>
            <input
              name="text"
              type="text"
              style={{ fontSize: 25, textAlign: "center" }}
              placeholder="Insert text"
              onChange={this.handleChange}
            />
            <br />
            <input type="submit" value="Add file" />
          </form>

          <br />
          <form onSubmit={this.handleRead}>
            <input
              name="text"
              type="text"
              style={{ fontSize: 25, textAlign: "center" }}
              placeholder="IPFS hash"
              onChange={this.handleChange}
            />
            <br />
            <input type="submit" value="Read a file" />
          </form>
        </header>
      </div>
    );
  }
}

export default App;
