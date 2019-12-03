var contract = window.web3 && web3.ss && web3.ss.contract(abi);
var instance = contract && contract.at(cAddr);
window.addEventListener('web3Ready', function() {
  contract = web3.ss.contract(abi);
  instance = contract.at(cAddr);
  reload();
});

instance.getInfo.call (function (e, r) {
  if (e) {
    console.log(e);
    return;
  } else {
    console.log(r);
    document.querySelector("#name").innerHTML = r[0];
    document.querySelector("#purchase").innerHTML = r[1];
    document.querySelector("#rebate").innerHTML = r[2];
  }
});

function buy (element) {
  element.innerHTML = "Wait ...";
  var n = window.prompt("Amount paid for purchase:");
  n && instance.buy(n);
  setTimeout(function () {
    instance.getInfo.call (function (e, r) {
      if (e) {
        console.log(e);
        return;
      } else {
        document.querySelector("#purchase").innerHTML = r[1];
        document.querySelector("#rebate").innerHTML = r[2];
        element.innerHTML = "Add";
      }
    });
  }, 2 * 1000);
}
