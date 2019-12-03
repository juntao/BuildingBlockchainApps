var contract = window.web3 && web3.ss && web3.ss.contract(abi);
var instance = contract && contract.at(cAddr);
window.addEventListener('web3Ready', function() {
  contract = web3.ss.contract(abi);
  instance = contract.at(cAddr);
  reload();
});

function reload() {
    document.querySelector("#totalBody").innerHTML = "";
    document.querySelector("#individualBody").innerHTML = "";
    var tbodyInner = "";
    esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
        var sha = JSON.parse(shaResult).abiSha3;
        esss.searchUsingAbi(sha).then((searchResult) => {
            var items = JSON.parse(searchResult);
            items.sort(compareItem);
            items.forEach(function(item) {
                tbodyInner = tbodyInner +
                    "<tr id='" + item.contractAddress + "'><td>" + item.functionData.getAccountName +
                    "</td><td>" + item.functionData.getAccountBalance +
                    "</td><td><button class='btn btn-info' onclick='setNumber(this)'>Update balance</button></td></tr>";
            }); // end of JSON iterator
            document.querySelector("#individualBody").innerHTML = tbodyInner;
            displayTotal();
        });
    }); // end of esss
}

function displayTotal() {
    esss.shaAbi(JSON.stringify(abi)).then((shaResult) => {
        var sha = JSON.parse(shaResult).abiSha3;
        esss.searchUsingAbi(sha).then((searchResult) => {
            var items = JSON.parse(searchResult);
            var totalBodyInner = "";
            var total = 0;
            items.forEach(function(item) {
                total = total + parseInt(item.functionData.getAccountBalance);
            });
            totalBodyInner = totalBodyInner + "<tr id='total'><td>" + total + "</tr>";
            document.querySelector("#totalBody").innerHTML = totalBodyInner;
        });
    }); // end of esss
}

function setNumber(element) {
    var tr = element.closest("tr");
    instance = contract.at(tr.id);
    var n = window.prompt("Input a number:");
    n && instance.setAccountBalance(n);
    setTimeout(function() {
        element.innerHTML = "Sending ...";
        esss.updateStateOfContractAddress(JSON.stringify(abi), instance.address).then((c2i) => {
            element.innerHTML = "Calculating ...";
            setTimeout(function() {
                reload();
            }, 5 * 1000);
        });
    }, 1 * 1000);
}

function compareItem(a, b) {
    let comparison = 0;
    if (a.functionData.getAccountName < b.functionData.getAccountName) {
        comparison = -1;
    } else if (a.functionData.getAccountName > b.functionData.getAccountName) {
        comparison = 1;
    }
    return comparison;
}
