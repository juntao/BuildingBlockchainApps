var instance = null;
window.addEventListener('web3Ready', function() {
  var contract = web3.ss.contract(abi);
  instance = contract.at(cAddr);

  var new_mesg = location.search.split('new_mesg=')[1];
    if (new_mesg === undefined || new_mesg == null) {
    } else {
      web3.ss.getAccounts(function (e, address) {
        new_mesg = decodeURIComponent(new_mesg.replace(/\+/g, '%20'));
        instance.updateMessage(new_mesg, {from: address}, function(error, result){
          if(!error)
            document.getElementById("status").innerHTML = 
              "<b>Submitted to blockchain</b>. " + 
              "The new message might take a few seconds to show up! <a href=''>Refresh page</a>";
        });
      });
    }
 
    instance.sayHello(function(error, result){
      if(!error)
        document.getElementById("mesg").innerHTML = result;
    });

});
