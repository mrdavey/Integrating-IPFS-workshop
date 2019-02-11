import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ipfs from './ipfs';
import getWeb3 from './getWeb3';
import ipfsContract from './contracts/Ipfs.json'


class App extends Component {

  ipfsContractInstance;

  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  async componentDidMount() {
    let web3 = await getWeb3
    this.setState({web3: web3})

    const contract = require('truffle-contract')

    this.ipfsContractInstance = contract(ipfsContract)
    this.ipfsContractInstance.setProvider(web3.currentProvider)
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

    let accounts = await this.state.web3.eth.getAccounts()
    let deployed = await this.ipfsContractInstance.deployed()
    let valueChanged = await deployed.changeHash(hash, { from: accounts[0] })
    console.log(valueChanged)
  }

  handleRead = async (event) => {
    event.preventDefault();

    let file = await ipfs.cat(this.state.value);
    console.log(file.toString('utf8'));
  }

  handleReadContract = async (event) => {
    event.preventDefault();

    let deployed = await this.ipfsContractInstance.deployed()
    let value = await deployed.latestHash()
    console.log(value)
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

          <br />
          <form onSubmit={this.handleReadContract}>
            <input type="submit" value="Read from contract" />
          </form>
        </header>
      </div>
    );
  }
}

export default App;
