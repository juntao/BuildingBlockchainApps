## Prerequisite

The developer tool to use in this chapter is the [BUIDL IDE](https://www.secondstate.io/buidl/). Just click on the link below from any browser!

**[Launch BUIDL IDE](http://buidl.secondstate.io/)**

## The smart contract code

In the *contract* tab.

```
pragma solidity >=0.4.0 <0.6.0;

contract SimpleStorage {
    uint storedData;

    function set(uint x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}
```

## The JavaScript code

In the *dapp -> JS* tab.

```javascript
...
/* Don't modify */

var instance = null;
window.addEventListener('web3Ready', function() {
  var contract = web3.ss.contract(abi);
  instance = contract.at(cAddr);
});

document.querySelector("#s").addEventListener("click", function() {
  var n = window.prompt("Enter the number:");
  n && instance.set(n);
});
document.querySelector("#g").addEventListener("click", function() {
  instance.get(function(e,d) {
    console.log(d.toString());
    alert(d.toString());
  });
});
```

## The HTML code

In the *dapp -> HTML* tab.

```html
<button id="s">Set Data</button>
<button id="g">Get Data</button>
```

## The CSS code

This optional. In the *dapp -> CSS* tab.

```css
button {
  background-color: #000;
  color: #fff;
  border: 0;
  font-size: 1em;
}
```

