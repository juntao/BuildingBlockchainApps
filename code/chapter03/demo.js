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
