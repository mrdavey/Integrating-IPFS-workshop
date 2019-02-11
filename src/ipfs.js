var ipfsClient = require('ipfs-http-client')
var ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

export default ipfs;