# Integrating IPFS with Ethereum project 101
This content is for a workshop I'm conducting as part of the [BUIDLx 2 event](http://buidl.events), where we'll cover topics about decentralised storage.

## React / JS side
### Create react-app
```
npx create-react-app ipfs
```

### Add IPFS library
```
cd ipfs
npm install --save ipfs-http-client
```

### Create IPFS helper
```
var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

export default ipfs;
```

### Use the helper in your App.js file
```
import ipfs from './ipfs';
```

### Add scaffolding
```
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  }

  handleAdd = async (event) => {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  handleRead = async (event) => {
    event.preventDefault();

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
```

### Add IPFS content (in handleAdd)
```
    let ipfsContent = {
      path: '/buidlams/buidl.txt',
      content: ipfs.types.Buffer.from(JSON.stringify(this.state.value))
    };

    let results = await ipfs.add(ipfsContent);
    let hash = results[0].hash;
    console.log("IPFS hash: " + hash);
    console.log("Address: https://gateway.ipfs.io/ipfs/" + hash);
```

### Read IPFS content (in handleRead)

```
    let file = await ipfs.cat(this.state.value);
    console.log(file.toString('utf8'));
```

#### Example BUIDL log IPFS file
`QmZVNsPTLt57KrgH9EW8FxhhrQo1gCio2iCkKzzANSNHZQ`

----

## Ethereum side

### Truffle setup
In the working directory:
```
npm install -g truffle

truffle init

npm install truffle-contract
```
Uncomment the development network in `truffle-config.js` (make sure port number is `7545` for Ganache)
```
  development: {
    host: "127.0.0.1",     // Localhost (default: none)
    port: 7545,            // Standard Ethereum port (default: none)
    network_id: "*",       // Any network (default: none)
  },
```

### Create simple solidity file
```
pragma solidity ^0.5.0;

contract Ipfs {
    string public latestHash;

    function changeHash(string memory _newHash) public returns (bool) {
        latestHash = _newHash;
        return true;
    }
}
```

### Add a migration step
`2_deploy_ipfs.js`

```
var ipfs = artifacts.require("./ipfs.sol");

module.exports = function (deployer) {
    deployer.deploy(ipfs);
};
```

### Compile and migrate contracts (use Ganache)
```
truffle migrate --reset

cd src
ln -s ../build/contracts contracts
```

### Add web3 helper
`getWeb3.js`
```
import Web3 from 'web3'

let getWeb3 = new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
        
        // Modern dapp browsers...
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                // Request account access if needed
                await window.ethereum.enable();
                // Acccounts now exposed, get correct network
                web3.eth.net.getId((err, netId) => {
                    if (Number(netId) !== 4 && Number(netId) < 99) { // Let us work in development chains (usually > 100)
                        resolve(Error("Wrong network selected. We are only live on Rinkeby! Please switch 🙏"))
                    } else {
                        resolve(web3)
                    }
                })
            } catch (error) {
                reject(error);
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            // Use Mist/MetaMask's provider.
            const web3 = window.web3;
            console.log("Injected web3 detected.");
            resolve(web3);
        }
        else {
            // No web3 provider available!
            resolve(Error("No Web3 provider detected! 😩 Try loading with a different browser or Metamask"))
        }
    });
});

export default getWeb3;
```
### Import web3 in App.js
```
import getWeb3 from './getWeb3';
```

### Import IPFS contract
At the top:
```
ipfsContractInstance;
```

then:
```
  async componentDidMount() {
    let web3 = await getWeb3
    this.setState({web3: web3})

    const contract = require('truffle-contract')

    this.ipfsContractInstance = contract(ipfsContract)
    this.ipfsContractInstance.setProvider(web3.currentProvider)
  }
```

### Add recording of text to blockchain
At the end of `handleAdd`:
```
  let accounts = await this.state.web3.eth.getAccounts()
  let deployed = await this.ipfsContractInstance.deployed()
  let valueChanged = await deployed.changeHash(hash, { from: accounts[0] })
  console.log(valueChanged)
```

### Add reading of value from contract
At the end of `render()`, but before `</header>`:
```
  <br />
  <form onSubmit={this.handleReadContract}>
    <input type="submit" value="Read from contract" />
  </form>
```

Add `handleReadContract` function:
```
  handleReadContract = async (event) => {
    event.preventDefault();

    let deployed = await this.ipfsContractInstance.deployed()
    let value = await deployed.latestHash()
    console.log(value)
  }
```

👏