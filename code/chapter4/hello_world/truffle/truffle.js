module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    testnet: {
      host: "172.33.0.218",
      port: 8545,
      network_id: 3, // Ropsten,
      from: "0x3d113a96a3c88dd48d6c34b3c805309cdd77b543",
      gas: 4000000,
      gasPrice: 20000000000
    }
  }
};
