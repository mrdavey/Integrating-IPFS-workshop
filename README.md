# Integrating IPFS with Ethereum project 101

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
