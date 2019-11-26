## Tools

The developer tool to use in this chapter is the [BUIDL IDE](https://www.secondstate.io/buidl/). Click on one of the links below from any browser! Remember to go to the *Accounts* tab and send a some tokens to the default address so that you can pay "gas" for your blockchain transactions.

* [Launch BUIDL for Ethereum](http://buidl.secondstate.io/eth)  | [Learn more](https://docs.secondstate.io/buidl-developer-tool/getting-started/develop-for-ethereum)
* [Launch BUIDL for Ethereum Classic](http://buidl.secondstate.io/etc) | [Learn more](https://docs.secondstate.io/buidl-developer-tool/getting-started/develop-for-ethereum-classic)
* [Launch BUIDL for CyberMiles](http://buidl.secondstate.io/cmt)  | [Learn more](https://docs.secondstate.io/buidl-developer-tool/getting-started/develop-for-cybermiles)

Alternatively, you will need the following tools to develop for Ethereum.

* [Metamask](https://metamask.io/)
* [Remix](https://remix.ethereum.org/)
* [Truffle Suite](https://www.trufflesuite.com/)
* [Web3.js](https://github.com/ethereum/web3.js/)
* [Solidity compiler](https://solidity.readthedocs.io/en/v0.5.3/installing-solidity.html)

## The smart contract code

```
pragma solidity ^0.4.17;

contract HelloWorld  {
    
    string helloMessage;
    address public owner;

    function HelloWorld () public {
        helloMessage = "Hello, World!";
        owner = msg.sender;
    }
    
    function updateMessage (string _new_msg) public {
        helloMessage = _new_msg;
    }

    function sayHello () public constant returns (string) {
        return helloMessage;
    }

    function kill() public { 
        if (msg.sender == owner) selfdestruct(owner); 
    }
}
```

## The HTML and JavaScript

To say hello, you do not need to use gas. You just need an RPC node to get the state of the contract.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="js/web3.min.js"></script>
    <script>
      web3 = new Web3(new Web3.providers.HttpProvider(
              "https://ropsten.infura.io/"));
      var hello = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "_new_msg", "type": "string" } ], "name": "updateMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "sayHello", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]).at("0x8bc27c8129eea739362d786ca0754b5062857e9c");
      var mesg = hello.sayHello();
    </script>
  </head>

  <body>
    <h2>The HelloWorld Contract says</h2>
    <p>
      <script>
        if (mesg === undefined || mesg == null) {
        } else {
          document.write(mesg)
        }
      </script>
    </p>
  </body>
</html>
```

To set the hello message, you will need to pay gas. The example below asks the user to use his or her metamask to pay for gas.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script>
      window.addEventListener('load', function() {
        if (typeof web3 !== 'undefined') {
          // Use MetaMask's provider
          window.web3 = new Web3(web3.currentProvider);
        } else {
          console.log('No web3? You should consider trying MetaMask!')
        }
        var hello = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "_new_msg", "type": "string" } ], "name": "updateMessage", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [], "name": "kill", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "sayHello", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" } ]).at("0x8bc27c8129eea739362d786ca0754b5062857e9c");
        var new_mesg = location.search.split('new_mesg=')[1];
        if (new_mesg === undefined || new_mesg == null) {
        } else {
          new_mesg = decodeURIComponent(new_mesg.replace(/\+/g, '%20'));
          hello.updateMessage(new_mesg, {from: "0x97dBC39D0A2C612428C61E932b0E7f1Da1373Ceb"}, function(error, result){
            if(!error)
              document.getElementById("status").innerHTML = 
                "<b>Submitted to blockchain</b>. " + 
                "The new message might take a few seconds to show up! " + 
                "<a href=\"helloworld_metamask.html\">Reload page.</a>";
          });
        }
 
        hello.sayHello(function(error, result){
          if(!error)
            document.getElementById("mesg").innerHTML = result;
        });
      })
    </script>
  </head>

  <body>
  <h2>Hello World</h2>
    <form method=GET>
      New message:<br/><br/>
      <input type="text" size="40" name="new_mesg"/><br/><br/>
      <input type="submit"/>
      <p id="status"/>
    </form>
    <p>The current message is: <span id="mesg"/></p> 
  </body>
</html>
```

## Use command line tools

* [The Truffle project](https://github.com/juntao/BuildingBlockchainApps/tree/master/code/chapter4/hello_world/truffle)
* [The dapp's web files](https://github.com/juntao/BuildingBlockchainApps/tree/master/code/chapter4/hello_world/dapp)


